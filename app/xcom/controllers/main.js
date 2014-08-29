var app = angular.module('xcom');

app.controller('mainController', ['$scope', 'appDataProvider', function($scope, appDataProvider) {
    $scope.appData = appDataProvider;
}]);