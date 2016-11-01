(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar.containers', {
                    url: '/containers',
                    templateUrl: 'app/view/containers/containers.html',
                    controller: 'ContainersController',
                    service: 'ContainerService'
                })
        })
})();
