(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.navbar.home', {
                    url: '/home',
                    templateUrl: 'app/view/navbar/home/home.html',
                    controller: 'HomeController'
                })
        })
})();
