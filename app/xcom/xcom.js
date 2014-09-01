var app = angular.module('xcom', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularMoment']);

app.constant('angularMomentConfig', {
    preprocess: 'utc'
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', { templateUrl: '/public/views/pages/index.html' })
        .when('/equipment', { templateUrl: '/public/views/pages/equipment.html' })
        .when('/settings', { templateUrl: '/public/views/pages/settings.html' });
}]);