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
                        repairers: function ($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('users/ROLE_USER').getList()
                                .then(function (data) {
                                    var repairers = [null];
                                    for (var i = 0; i < data.length; i++) {
                                        repairers.push(data[i]);
                                    }
                                    deferred.resolve(repairers);
                                })
                                .catch(function () {
                                    deferred.resolve([]);
                                });
                            return deferred.promise;
                        },
                        containers: function ($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('containers').getList().then(function (data) {
                                var items = data;
                                for (var i = 0; i < items.length; i++) {
                                    items[i].sensors.load.value = parseFloat(items[i].sensors.load.value);
                                }
                                deferred.resolve(items);
                            });
                            return deferred.promise;
                        },
                        containersToRepair: function ($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('containers/toRepair').getList()
                                .then(function (data) {
                                    var items = data;
                                    deferred.resolve(items);
                                })
                                .catch(function () {
                                    deferred.resolve([])
                                });
                            return deferred.promise;
                        }
                    }
                })
        })
})();
