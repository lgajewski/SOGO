(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.trucks', {
                    url: '/trucks',
                    templateUrl: 'app/view/trucks/trucks.html',
                    controller: 'TrucksController',
                    service: 'TruckService'
                })
        })
})();
