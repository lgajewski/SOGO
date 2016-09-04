(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/view/signup/signup.html'
                })
        })
})();
