var app = angular.module('xcom', ['ngRoute', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'angularMoment']);

app.constant('angularMomentConfig', {
    preprocess: 'utc'
});

app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
    $routeProvider
        .when('/', { templateUrl: '/public/views/pages/index.html' })
        .when('/equipment', { templateUrl: '/public/views/pages/equipment.html' })
        .when('/settings', { templateUrl: '/public/views/pages/settings.html' });

    $translateProvider
        .useStaticFilesLoader({
            prefix: '/public/translations/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'ru'], {
            'en_US': 'en',
            'en_UK': 'en',
            'ru_RU': 'ru',
        })
        .determinePreferredLanguage()
        .useLocalStorage();
}]);
