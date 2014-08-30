var app = angular.module('xcom', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', { templateUrl: '/public/views/pages/index.html' });
}]);