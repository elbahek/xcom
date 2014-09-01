var app = angular.module('xcom');

app.controller('mainController', ['$scope', '$location', 'appDataProvider', function($scope, $location, appDataProvider) {
    $scope.appData = appDataProvider;

    $scope.go = function(url) {
        $location.path(url);
    };
}]);