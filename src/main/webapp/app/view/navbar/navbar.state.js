(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar', {
                    abstract: true,
                    templateUrl: 'app/view/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                })
        })
})();
