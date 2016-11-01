(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('reset', {
                    url: '/reset?key',
                    parent: 'simple',
                    templateUrl: 'app/view/simple/reset/reset.html',
                    controller: 'ResetController',
                    controllerAs: 'vm'
                })
        })
})();
