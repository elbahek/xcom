var app = angular.module('xcom');

app.directive('xcomReference', ['$compile', 'helpersFactory', function($compile, helpersFactory) {
    var referenceTemplatesPath = '/public/views/partials/reference';
    var defaultColumnParameters = {
        type: 'text',
        isReadOnly: false,
        display: true,
        isRadio: false,
        isMultiple: false,
        referenceLinkSource: null
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

                    // add default translations
                    if (column.translate === undefined) {
                        column.translate = 'references.columnsGeneral.' + column.name;
                    }

                    // add template name
                    var cellTemplateName = helpersFactory.convertToCssCase(column.type) + '-cell';
                    column.cellTemplatePath = referenceTemplatesPath + '/' + cellTemplateName +'.html';

                    // flag if column is already merged in with default parameters
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