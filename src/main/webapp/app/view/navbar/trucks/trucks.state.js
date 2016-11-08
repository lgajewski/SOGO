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
                        trucks: function($q, Restangular){
                            var deferred = $q.defer();
                            Restangular.all('trucks').getList().then(function (data) {
                                var items = data;
                                deferred.resolve(items);
                            });
                            return deferred.promise;
                        }
                    }
                })
        })
})();
