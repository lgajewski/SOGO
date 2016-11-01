(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.simple.login', {
                    url: '/login',
                    templateUrl: 'app/view/simple/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                })
        })
})();
