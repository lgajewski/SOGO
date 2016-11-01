(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    parent: 'simple',
                    templateUrl: 'app/view/simple/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                })
        })
})();
