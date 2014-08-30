var app = angular.module('xcom');

app.directive('xcomBasesTimeControls', function() {
    return {
        restrict: 'E',
        templateUrl: '/public/views/partials/bases-time-controls.html'
    };
});