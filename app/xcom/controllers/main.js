var app = angular.module('xcom');

app.controller('mainController', ['$scope', '$location', '$translate', 'amMoment', 'appDataProvider', function($scope, $location, $translate, amMoment, appDataProvider) {
    $scope.appData = appDataProvider;
    $scope.userData = {
        language: $translate.proposedLanguage()
    };

    $scope.go = function(url) {
        $location.path(url);
    };

    $scope.setLanguage = function() {
        $translate.use($scope.userData.language);
        amMoment.changeLanguage($scope.userData.language);
    };

    $scope.setLanguage();
}]);