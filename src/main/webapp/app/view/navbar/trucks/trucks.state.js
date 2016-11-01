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
                    controller: 'TrucksController'
                })
        })
})();
