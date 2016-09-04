(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar.home', {
                    url: '/home',
                    templateUrl: 'app/view/home/home.html',
                    controller: 'HomeController',
                    service: 'sharedProperties'
                })
        })
})();
