(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.profile', {
                    url: '/profile',
                    templateUrl: 'app/view/profile/profile.html',
                    controller: 'ProfileController'
                })
        })
})();
