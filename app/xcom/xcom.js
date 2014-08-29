var app = angular.module('xcom', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularMoment']);

app.constant('angularMomentConfig', {
    preprocess: 'utc'
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', { templateUrl: '/public/views/pages/index.html' });
}]);