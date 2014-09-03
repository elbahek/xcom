var app = angular.module('xcom');

app.controller('settingsController', ['$rootScope', '$scope', '$translate', 'amMoment', function($rootScope, $scope, $translate, amMoment) {
    $rootScope.pageClass = 'settings';
    $scope.userData = {
        language: $translate.use()
    };

    $scope.setLanguage = function() {
        $translate.use($scope.userData.language);
        amMoment.changeLanguage($scope.userData.language);
    };

    $scope.setLanguage();
}]);