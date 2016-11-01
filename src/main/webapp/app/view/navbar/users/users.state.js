(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('users', {
                    url: '/users',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/users/users.html',
                    controller: 'UsersController'
                })
        })
})();
