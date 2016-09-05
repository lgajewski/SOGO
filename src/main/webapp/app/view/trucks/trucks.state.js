(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.trucks', {
                    url: '/trucks',
                    templateUrl: 'app/view/trucks/trucks.html',
                    controller: 'TrucksController'
                })
                .state('navbar.new_truck', {
                    url: '/trucks',
                    templateUrl: 'app/view/trucks/new_truck.html',
                    controller: 'TrucksController'
                })
        })
})();
