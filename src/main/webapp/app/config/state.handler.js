(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('stateHandler', stateHandler);

    stateHandler.$inject = ['$rootScope', 'Auth'];

    function stateHandler($rootScope, Auth) {
        return {
            initialize: initialize
        };

        function initialize() {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                $rootScope.fromState = fromState;

                Auth.authorize();
            });
        }
    }
})();
