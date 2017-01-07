angular
    .module('sogo')
    .directive('playButton', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: '<button type="button" class="btn btn-lg pull-right"><i class="glyphicon glyphicon-{{icon}}"></i></button>',
            link: function (scope, elem, attrs) {
                scope.$watch(attrs['ngModel'], function (running) {
                    if (running) {
                        scope.icon = "stop";
                        elem.removeClass("btn-success");
                        elem.addClass("btn-danger");
                    } else {
                        scope.icon = "play";
                        elem.removeClass("btn-danger");
                        elem.addClass("btn-success");
                    }
                });
            }
        }
    }]);
