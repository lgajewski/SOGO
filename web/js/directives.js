'use strict';

/* Directives */

angular.module('sogo.directives', [])

.directive('inFooter', [
    function () {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            templateUrl: '/partials/directives/in_footer.html',
            link: function ($scope) {
                $scope.$watch('user', function () {
                    $scope.showData = ($scope.user != undefined);
                });

            }
        }
    }
]);