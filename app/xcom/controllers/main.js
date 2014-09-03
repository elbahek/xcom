var app = angular.module('xcom');

app.controller('mainController', ['$rootScope', '$scope', '$location', 'appDataProvider', function($rootScope, $scope, $location, appDataProvider) {
    $rootScope.pageClass = 'generic';
    $scope.appData = appDataProvider;

    $scope.go = function(url) {
        $location.path(url);
    };
}]);