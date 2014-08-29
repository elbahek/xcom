var app = angular.module('xcom');

app.provider('appDataProvider', function() {
    return {
        $get: function($interval) {
            var appData = {
                currentDateTime: null,
                isSkippingTime: false,
                skipTimeIntervalRef: null,
                bases: null,
                baseContext: null,
                basesColors: [
                    { color: '#007845', isUsed: true },
                    { color: '#9C0063', isUsed: true },
                    { color: '#3D6A7D', isUsed: true },
                    { color: '#FFCC00', isUsed: false },
                    { color: '#FF2400', isUsed: false },
                    { color: '#AA1111', isUsed: false },
                    { color: '#548FF4', isUsed: false },
                ],

                setBaseContext: function(selectedBase) {
                    for (var i in this.bases) {
                        var base = this.bases[i];
                        base.isSelected = false;
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
                    console.log(this.isSkippingTime, this.skipTimeIntervalRef);
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

                appData.setBaseContext(appData.bases[1]);
            };

            prepareData();

            return appData;
        }
    };
});