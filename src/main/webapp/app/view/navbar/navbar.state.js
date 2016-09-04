(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar', {
                    abstract: true,
                    templateUrl: 'app/view/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'co'
                })
        })
})();
