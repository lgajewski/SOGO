(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.login', {
                    url: '/login',
                    templateUrl: 'app/view/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                })
        })
})();
