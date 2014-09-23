var app = angular.module('xcom');

app.provider('appDataProvider', function() {
    return {
        $get: ['$interval', '$http', function($interval, $http) {
            var appData = {
                currentDateTime: null,
                isSkippingTime: false,
                skipTimeIntervalRef: null,
                bases: [],
                baseContext: null,
                references: [
                    {
                        id: 1,
                        name: 'basesColors',
                        translate: 'references.basesColors.name',
                        columns: [
                            { name: 'id', display: false },
                            { name: 'color', translate: 'references.basesColors.columns.color', type: 'color' },
                            { name: 'isAvailable', translate: 'references.basesColors.columns.isAvailable', type: 'boolean', isReadOnly: true }
                        ],
                        data: [
                            { id: 1, color: '#007845', isAvailable: false },
                            { id: 2, color: '#9C0063', isAvailable: false },
                            { id: 3, color: '#3D6A7D', isAvailable: false },
                            { id: 4, color: '#FFCC00', isAvailable: true },
                            { id: 5, color: '#FF2400', isAvailable: true },
                            { id: 6, color: '#AA1111', isAvailable: true },
                            { id: 7, color: '#548FF4', isAvailable: true }
                        ]
                    },
                    {
                        id: 2,
                        name: 'enemies',
                        translate: 'references.enemies.name',
                        columns: [
                            { name: 'id', display: false },
                            { name: 'name' }
                        ],
                        data: [
                            { id: 8, name: 'sectoid' },
                            { id: 9, name: 'sectoid commander' }
                        ]
                    },
                    {
                        id: 3,
                        name: 'combatTypes',
                        translate: 'references.combatTypes.name',
                        columns: [
                            { name: 'id', display: false },
                            { name: 'name' },
                            { name: 'earthCombatTemplate', translate: 'references.earthCombatTemplates.name', type: 'referenceLink', referenceLinkSource: null }
                        ],
                        data: [
                            { id: 10, name: 'generic combat', earthCombatTemplate: null },
                            { id: 11, name: 'assault', earthCombatTemplate: null }
                        ]
                    },
                    {
                        id: 4,
                        name: 'earthCombatTemplates',
                        translate: 'references.earthCombatTemplates.name',
                        columns: [
                            { name: 'id', display: false },
                            { name: 'name' },
                            { name: 'enemies', translate: 'references.enemies.name', type: 'referenceLink', referenceLinkSource: null, isMultiple: true },
                        ],
                        data: [
                            { id: 12, name: 'weakest', enemies: [] },
                            { id: 13, name: 'weak', enemies: [] }
                        ]
                    }
                ],

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

                findReferenceByName: function(referenceName, foundReferenceCallback) {
                    for (var i in this.references) {
                        var reference = this.references[i];
                        if (reference.name === referenceName) {
                            foundReferenceCallback(reference);
                            break;
                        }
                    }
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
                    if (angular.isString(lastArg) && ['GET', 'POST'].indexOf(lastArg.toUpperCase()) !== -1) {
                        method = lastArg.toUpperCase();
                    }
                }

                $http({ method: method, url: url, data: data })
                    .success(function(response) {
                        successCallback(response.data);
                    })
                    .error(function(response, status) {
                        console.log('Status: ' + status + '; Response: ');
                        console.trace(response);
                    });
            };

            var tempPrepareReferences = function() {
                appData.references[2].columns[2].referenceLinkSource = appData.references[3];
                appData.references[2].data[0].earthCombatTemplate = appData.references[3].data[0];
                appData.references[2].data[1].earthCombatTemplate = appData.references[3].data[1];

                appData.references[3].columns[2].referenceLinkSource = appData.references[1];
                appData.references[3].data[0].enemies = [ appData.references[1].data[0], appData.references[1].data[0] ];
                appData.references[3].data[1].enemies = [ appData.references[1].data[0], appData.references[1].data[1] ];
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

            backendRequest('/all', 'GET', function(data) {
                prepareVariables(data.variables);
                prepareBases(data.bases);
                tempPrepareReferences();
            });


            return appData;
        }]
    };
});