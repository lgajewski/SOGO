(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.simple.signup', {
                    url: '/signup',
                    templateUrl: 'app/view/simple/signup/signup.html',
                    controller: 'SignupController',
                    controllerAs: 'vm'
                })
        })
})();
