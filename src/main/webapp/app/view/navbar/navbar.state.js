(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar', {
                    abstract: true,
                    parent: 'app',
                    templateUrl: 'app/view/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                })
        })
})();
