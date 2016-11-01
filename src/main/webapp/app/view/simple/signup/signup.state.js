(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('signup', {
                    url: '/signup',
                    parent: 'simple',
                    templateUrl: 'app/view/simple/signup/signup.html',
                    controller: 'SignupController',
                    controllerAs: 'vm'
                })
        })
})();
