var app = angular.module('xcom');

app.provider('appDataProvider', function() {
    return {
        $get: ['$interval', function($interval) {
            var appData = {
                currentDateTime: null,
                isSkippingTime: false,
                skipTimeIntervalRef: null,
                bases: null,
                baseContext: null,
                references: [
                    {
                        name: 'basesColors',
                        translate: 'references.basesColors.name',
                        columns: [
                            { name: 'color', translate: 'references.basesColors.columns.color', type: 'colorpicker' },
                            { name: 'isAvailable', translate: 'references.basesColors.columns.isAvailable', type: 'boolean', isReadOnly: true }
                        ],
                        data: [
                            { color: '#007845', isAvailable: false },
                            { color: '#9C0063', isAvailable: false },
                            { color: '#3D6A7D', isAvailable: false },
                            { color: '#FFCC00', isAvailable: true },
                            { color: '#FF2400', isAvailable: true },
                            { color: '#AA1111', isAvailable: true },
                            { color: '#548FF4', isAvailable: true }
                        ]
                    },
                    {
                        name: 'enemies',
                        translate: 'references.enemies.name',
                        columns: [
                            { name: 'title', translate: 'references.enemies.columns.title' }
                        ],
                        data: [
                            { title: 'sectoid' },
                            { title: 'sectoid commander' }
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
                    this.currentDateTime[operation](unit, num);
                    this.recalculateBasesDateTimes();
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
                }

            };

            var prepareData = function() {  
                appData.currentDateTime = moment().utc();

                var bases = [
                    { location: 'Vancouver', timezone: 'America/Vancouver', currentDateTime: null, color: '#007845', isMain: true, isSelected: false },
                    { location: 'Zurich', timezone: 'Europe/Zurich', currentDateTime: null, color: '#9C0063', isMain: false, isSelected: false },
                    { location: 'Kiev', timezone: 'Europe/Kiev', currentDateTime: null, color: '#3D6A7D', isMain: false, isSelected: false }
                ];
                appData.bases = bases;
                appData.recalculateBasesDateTimes();

                appData.setBaseContext();
            };

            prepareData();

            return appData;
        }]
    };
});