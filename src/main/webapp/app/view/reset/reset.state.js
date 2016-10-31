(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('reset', {
                    url: '/reset?key',
                    templateUrl: 'app/view/reset/reset.html',
                    controller: 'ResetController',
                    controllerAs: 'vm'
                })
        })
})();
