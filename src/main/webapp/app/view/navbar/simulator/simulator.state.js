(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('simulator', {
                    url: '/simulator',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/simulator/simulator.html',
                    controller: 'SimulatorController',
                    resolve: {
                        isTrucksSimulatorRunning: function($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('simulator/trucks').customGET().then(function (data) {
                                deferred.resolve(data.state);
                            });

                            return deferred.promise;
                        },
                        isContainersSimulatorRunning: function($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('simulator/containers').customGET().then(function (data) {
                                deferred.resolve(data.state);
                            });

                            return deferred.promise;
                        }
                    }
                })
        })
})();
