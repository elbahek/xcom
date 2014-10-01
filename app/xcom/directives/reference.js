var app = angular.module('xcom');

app.directive('xcomReference', [function() {
    var referenceTemplatesPath = '/public/views/partials/reference';

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function($scope) {
            $scope.columnTemplates = {
                text: '/public/views/partials/reference/text-cell.html',
                picture: '/public/views/partials/reference/text-cell.html'
            };
        },
        templateUrl: '/public/views/partials/reference/main.html'
    };
}]);