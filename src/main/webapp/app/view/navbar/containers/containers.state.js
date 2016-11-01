(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('containers', {
                    url: '/containers',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/containers/containers.html',
                    controller: 'ContainersController',
                    service: 'ContainerService'
                })
        })
})();
