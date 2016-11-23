(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('trucks', {
                    url: '/trucks',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/trucks/trucks.html',
                    controller: 'TrucksController',
                    resolve: {
                        trucks: function (Restangular) {
                            return Restangular.all('trucks').getList();
                        },
                        users: function (currentUser, Restangular) {
                            if (currentUser.authorities.indexOf('ROLE_SYSTEM_MANAGER') > -1) {
                                return Restangular.all('users/ROLE_USER').getList();
                            } else {
                                return Promise.resolve([]);
                            }
                        }
                    }
                })
        })
})();
