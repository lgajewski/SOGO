(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('simple', {
                    abstract: true,
                    parent: 'app',
                    templateUrl: 'app/view/simple/simple.html'
                })
        })
})();
