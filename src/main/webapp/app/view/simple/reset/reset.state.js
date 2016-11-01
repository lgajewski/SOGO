(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.simple.reset', {
                    url: '/reset?key',
                    templateUrl: 'app/view/simple/reset/reset.html',
                    controller: 'ResetController',
                    controllerAs: 'vm'
                })
        })
})();
