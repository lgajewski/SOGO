(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/home/home.html',
                    controller: 'HomeController'
                })
        })
})();
