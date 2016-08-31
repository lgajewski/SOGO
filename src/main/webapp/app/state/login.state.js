(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'partials/views/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    resolve: {
                        authorize: ['Auth',
                            function (Auth) {
                                return Auth.authorize();
                            }
                        ]
                    }
                })
        })
})();
