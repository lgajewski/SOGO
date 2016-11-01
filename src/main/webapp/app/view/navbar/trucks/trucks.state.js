(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar.trucks', {
                    url: '/trucks',
                    templateUrl: 'app/view/navbar/trucks/trucks.html',
                    controller: 'TrucksController'
                })
        })
})();
