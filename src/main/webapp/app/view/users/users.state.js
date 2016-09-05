(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.users', {
                    url: '/users',
                    templateUrl: 'app/view/users/users.html',
                    controller: 'UsersController'
                })
                .state('navbar.new_user', {
                    url: '/users',
                    templateUrl: 'app/view/users/new_user.html',
                    controller: 'UsersController'
                })
        })
})();
