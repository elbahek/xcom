var app = angular.module('xcom');

app.controller('referencesController', ['$rootScope', '$scope', 'appDataProvider', function($rootScope, $scope, appDataProvider) {
    $rootScope.pageClass = 'references';
    $scope.appData = appDataProvider;
}]);