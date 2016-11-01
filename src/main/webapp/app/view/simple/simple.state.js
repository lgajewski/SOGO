(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.simple', {
                    abstract: true,
                    templateUrl: 'app/view/simple/simple.html'
                })
        })
})();
