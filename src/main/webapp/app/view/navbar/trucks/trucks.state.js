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
                            var extractAddress = t => t.address || "[" + t.location.latitude.toFixed(4) + ", " + t.location.longitude.toFixed(4) + "]";

                            return Restangular.all('trucks').getList()
                                .then(function (trucks) {
                                    trucks.forEach(t => t.address = extractAddress(t));
                                    return Promise.resolve(trucks);
                                });
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
