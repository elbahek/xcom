var app = angular.module('xcom');

app.controller('mainController', ['$rootScope', '$scope', '$location', 'appDataProvider', function($rootScope, $scope, $location, appDataProvider) {
    $rootScope.pageClass = 'generic';
    $scope.appData = appDataProvider;
    $scope.topRightWidgets = {
        widgetsWrapperClass: 'closed',
        widgetsState: {
            basesTimeControlsVisible: false,
            testVisible: false
        }
    };

    $scope.go = function(url) {
        $location.path(url);
    };

    $scope.toggleTrWidget = function(name) {
        switch (name) {
            case 'basesTimeControls':
            case 'test':
                var propertyName = name + 'Visible';
                break;
            default:
                return;
        }
        var previousState = $scope.topRightWidgets.widgetsState[propertyName];
        for (var i in $scope.topRightWidgets.widgetsState) {
            $scope.topRightWidgets.widgetsState[i] = false;
        }

        if (previousState === false) {
            $scope.topRightWidgets.widgetsState[propertyName] = true;
            $scope.topRightWidgets.widgetsWrapperClass = 'opened';
        }
        else {
            $scope.topRightWidgets.widgetsWrapperClass = 'closed';
        }
    };
}]);