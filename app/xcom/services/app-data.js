var app = angular.module('xcom');

app.provider('appDataProvider', function() {
    return {
        $get: ['$interval', '$http', '$q', '$translate', 'helpersFactory', function($interval, $http, $q, $translate, helpersFactory) {
            var appData = {
                currentDateTime: null,
                isSkippingTime: false,
                skipTimeIntervalRef: null,
                bases: [],
                baseContext: null,
                permissions: null,
                references: [],
                currentReference: null,

                setBaseContext: function(selectedBase) {
                    for (var i in this.bases) {
                        var base = this.bases[i];
                        base.isSelected = false;
                        if (selectedBase === undefined && base.isMain) {
                            selectedBase = base;
                        }
                    }
                    this.baseContext = selectedBase;
                    this.baseContext.isSelected = true;
                },

                changeCurrentDateTime: function(operation, num, unit) {
                    if (['add', 'subtract'].indexOf(operation) === -1) return;
                    if (['days', 'hours', 'minutes'].indexOf(unit) === -1) return;
                    if (!angular.isNumber(num)) return;
                    var appData = this;
                    backendRequest(
                        '/set-current-datetime',
                        {operation: operation, num: num, unit: unit},
                        function(dateTime) {
                            appData.currentDateTime = moment(dateTime.value).utc();
                            appData.recalculateBasesDateTimes();
                        }
                    );
                },

                recalculateBasesDateTimes: function() {
                    for (var i in this.bases) {
                        var base = this.bases[i];
                        base.currentDateTime = moment(this.currentDateTime).tz(base.timezone);
                    }
                },

                toggleSkipTime: function() {
                    this.isSkippingTime = !this.isSkippingTime;
                    var appData = this;
                    if (this.isSkippingTime) {
                        appData.skipTimeIntervalRef = $interval(function() {
                            appData.changeCurrentDateTime('add', 1, 'hours');
                        }, 500);
                    }
                    else {
                        $interval.cancel(this.skipTimeIntervalRef);
                        this.skipTimeIntervalRef = null;
                    }
                },

                setCurrentReference: function(reference) {
                    this.currentReference = reference;
                },

                saveReferenceItem: function(data, referenceName, columnName) {
                    return backendRequest(
                        '/save-reference-item',
                        { id: data.id, values: data.values, referenceName: referenceName, columnName: columnName },
                        function(saveResponse) {
                            return saveResponse;
                        }
                    )
                    .then(function(httpResponse) {
                        var deferred = $q.defer();
                        if (!httpResponse.data.data.validationSuccess) {
                            deferred.resolve(httpResponse.data.data.validationMessages.join('. '));
                        }
                        else {
                            deferred.resolve();
                        }

                        return deferred.promise;
                    });
                },

                removeChildFromMultipleReference: function(list, position) {
                    for (var i in list) {
                        if (i == position) {
                            list.splice(position, 1);
                            break;
                        }
                    }
                }

            };

            var backendRequest = function(url) {
                if (url === undefined) return;
                url = '/backend' + url;
                var args = Array.prototype.slice.call(arguments, 0).sort();
                var method = 'POST';
                var data = null;
                var successCallback = null;
                while (args.length > 1) {
                    var lastArg = args.pop();
                    if (angular.isFunction(lastArg)) {
                        successCallback = lastArg;
                    }
                    if (angular.isObject(lastArg)) {
                        data = lastArg;
                    }
                }

                return $http({ method: method, url: url, data: data })
                    .success(function(response) {
                        return successCallback(response.data);
                    })
                    .error(function(response, status) {
                        console.log('Status: ' + status + '; Response: ');
                        console.trace(response);
                    });
            };

            var prepareVariables = function(variables) {
                for (var i in variables) {
                    var name = variables[i].name;
                    var value = variables[i].value;
                    if (name === 'currentDateTime') {
                        appData[name] = moment(value).utc();
                    }
                    else {
                        appData[name] = value;
                    }
                }
            };

            var prepareBases = function(bases) {
                for (var i in bases) {
                    var base = bases[i];
                    base.currentDateTime = null;
                    base.isSelected = null;
                    appData.bases.push(base);
                }
                appData.recalculateBasesDateTimes();
                appData.setBaseContext();
            };

            var mergeInDefaultColumnParameters = function(column, reference) {
                var defaultColumnParameters = {
                    type: 'text',
                    /*
                    isReadOnly: false,
                    display: true,
                    isRadio: false,
                    isMultiple: false,
                    referenceLinkSource: null
                    */
                };
                var tmp = angular.copy(defaultColumnParameters);
                column = helpersFactory.extendDeep(tmp, column);

                // add translations
                var columnSpecificTranslation = 'references.'+ reference.name +'.columns.'+ column.name;
                var columnDefaultTranslation = 'references.columnsGeneral.'+ column.name;
                if (column.translate === undefined) {
                    $translate(columnSpecificTranslation)
                        .then(function(translation) {
                            column.translate = columnSpecificTranslation;
                        })
                        .catch(function() {
                            column.translate = columnDefaultTranslation;
                        });
                }

                return column;
            };

            var prepareReferences = function(rawReferences) {
                var references = [];
                for (var i in rawReferences) {
                    if (!rawReferences.hasOwnProperty(i)) continue;
                    var rawReference = rawReferences[i];
                    var rawColumn = null;
                    var reference = {};
                    reference.name = rawReference.name;
                    reference.translate = 'references.'+ reference.name +'.name';
                    reference.columns = [];
                    reference.data = [];
                    for (var j in rawReference.columns) {
                        if (!rawReference.columns.hasOwnProperty(j)) continue;
                        rawColumn = rawReference.columns[j];
                        var column = {};
                        column.name = rawColumn.name;
                        column.order = rawColumn.order;
                        if (rawColumn.options !== null && rawColumn.options !== undefined) {
                            var options = JSON.parse(rawColumn.options);
                            for (var k in options) {
                                if (options.hasOwnProperty(k)) continue;
                                column[k] = options[k];
                            }
                        }
                        column = mergeInDefaultColumnParameters(column, reference);
                        reference.columns.push(column);
                    }

                    if (rawReference.columns[0].data.length > 0) {
                        for (var l in rawReference.columns[0].data) {
                            var dataRow = {};
                            dataRow.order = rawReference.columns[0].data[l].order;
                            for (var m in rawReference.columns) {
                                if (!rawReference.columns.hasOwnProperty(m)) continue;
                                rawColumn = rawReference.columns[m];
                                var values = {
                                    id: rawColumn.data[l].id,
                                    values: null
                                };
                                if (rawColumn.data[l].values.length === 1) {
                                    values.values = rawColumn.data[l].values[0].value;
                                }
                                else if (rawColumn.data[l].values.length > 1) {
                                    values.values = [];
                                    for (var n in rawColumn.data[l].values) {
                                        if (!rawColumn.data[l].values.hasOwnProperty(n)) continue;
                                        values.values.push(rawColumn.data[l].values[n].value);
                                    }
                                }
                                dataRow[rawColumn.name] = values;
                            }
                            reference.data.push(dataRow);
                        }
                    }

                    references.push(reference);
                }
                appData.references = references;
            };

            backendRequest('/all', function(data) {
                prepareVariables(data.variables);
                prepareBases(data.bases);
                appData.permissions = data.permissions;
                prepareReferences(data.references);

                appData.setCurrentReference(appData.references[0]);
            });


            return appData;
        }]
    };
});