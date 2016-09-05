(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.containers', {
                    url: '/containers',
                    templateUrl: 'app/view/containers/containers.html',
                    controller: 'ContainersController',
                    service: 'ContainerService'
                })
                .state('navbar.new_container',{
                    url: '/containers',
                    templateUrl: 'app/view/containers/new_container.html',
                    controller: 'ContainersController',
                    service: 'ContainerService'
                })
        })
})();
