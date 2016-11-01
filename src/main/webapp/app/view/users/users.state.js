(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar.users', {
                    url: '/users',
                    templateUrl: 'app/view/users/users.html',
                    controller: 'UsersController'
                })
        })
})();
