(function () {
    'use strict';

    angular
        .module('sogo')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            template: "<ui-view/>", // Abstract states still need their own <ui-view/>
            controller: function ($rootScope, Auth) {
                // authorize state changes
                $rootScope.$on('$stateChangeStart', (event, toState, toStateParams, fromState) => {
                    Auth.isAuthorized();
                });
            },
            resolve: {
                authorize: function (Auth) {
                    // make a request to gain fresh CSRF token
                    return Auth.isAuthorized();
                }
            }
        });
    }
})();
