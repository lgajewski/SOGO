(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.signup', {
                    url: '/signup',
                    templateUrl: 'app/view/signup/signup.html',
                    controller: 'SignupController',
                    controllerAs: 'vm'
                })
        })
})();
