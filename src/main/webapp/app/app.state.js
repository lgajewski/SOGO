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
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.isAuthorized();
                    }
                ]
            }
        });
    }
})();
