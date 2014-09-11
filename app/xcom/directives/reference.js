var app = angular.module('xcom');

app.directive('xcomReference', ['$compile', 'helpersFactory', function($compile, helpersFactory) {
    var referenceTemplatesPath = '/public/views/partials/reference';
    var defaultColumnParameters = {
        type: 'text',
        isReadOnly: false
    };

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function($scope) {
            function mergeInDefaultParameters(column) {
                var alreadyMergedIn = column._isMerged !== undefined && column._isMerged === true;
                if (!alreadyMergedIn) {
                    var tmp = angular.copy(defaultColumnParameters);
                    column = helpersFactory.extendDeep(tmp, column);

                    var cellTemplateName = column.type + 'Cell';
                    column.cellTemplatePath = referenceTemplatesPath + '/' + cellTemplateName +'.html';

                    column._isMerged = true;
                    return column;
                }

                return column;
            }

            $scope.$watch('currentReference.name', function() {
                for (var i in $scope.currentReference.columns) {
                    $scope.currentReference.columns[i] = mergeInDefaultParameters($scope.currentReference.columns[i]);
                }
            });
        },
        templateUrl: '/public/views/partials/reference/main.html'
    };
}]);