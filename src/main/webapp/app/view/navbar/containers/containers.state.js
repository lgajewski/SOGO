(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar.containers', {
                    url: '/containers',
                    templateUrl: 'app/view/navbar/containers/containers.html',
                    controller: 'ContainersController',
                    service: 'ContainerService'
                })
        })
})();
