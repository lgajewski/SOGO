(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('containers', {
                    url: '/containers',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/containers/containers.html',
                    controller: 'ContainersController',
                    service: 'ContainerService',
                    resolve: {
                        repairers: function (currentUser, Restangular) {
                            if (currentUser.authorities.indexOf('ROLE_SYSTEM_MANAGER') > -1) {
                                return Restangular.all('users/ROLE_USER').getList();
                            } else {
                                return Promise.resolve([]);
                            }
                        },
                        containers: function (Restangular) {
                            var extractAddress = t => t.address || "[" + t.location.latitude.toFixed(4) + ", " + t.location.longitude.toFixed(4) + "]";
                            return Restangular.all('containers').getList()
                                .then(function (containers) {
                                    containers.forEach(t => t.sensors.load.value = parseFloat(t.sensors.load.value));
                                    containers.forEach(t => t.address = extractAddress(t));
                                    return Promise.resolve(containers);
                                });
                        },
                        containersToRepair: function (Restangular) {
                            return Restangular.all('containers/toRepair').getList()
                                .catch(function () {
                                    return Promise.resolve([]);
                                });
                        }
                    }
                })
        })
})();
