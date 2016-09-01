(function () {
    'use strict';

    angular
        .module('sogo', [
            'ui.router',
            'ngResource',
            'ngStorage',
            'sogo.services',
            'sogo.directives',
            'sogo.controllers',
            'restangular',
            'uiGmapgoogle-maps'
        ])

        .config(function ($stateProvider) {
            $stateProvider
                .state('404', {
                    templateUrl: 'partials/404.html'
                })
                .state('greeting', {
                    url: '/greeting',
                    templateUrl: 'partials/views/greeting.html',
                    controller: 'GreetingController',
                    service: 'GreetingService'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'partials/views/signup.html'
                })
                .state('navbar', {
                    templateUrl: 'partials/views/navbar.html',
                    controller: function (Auth) {
                        this.logout = Auth.logout;
                    },
                    controllerAs: 'co'
                })
                .state('navbar.home', {
                    url: '/home',
                    templateUrl: 'partials/views/home.html',
                    controller: 'HomeController',
                    service: 'sharedProperties'
                })
                .state('navbar.trucks', {
                    url: '/trucks',
                    templateUrl: 'partials/views/trucks.html',
                    controller: 'TruckController',
                    service: 'TruckService'
                })
                .state('navbar.trucks-user', {
                    url: '/trucks-user',
                    templateUrl: 'partials/views/trucks-user.html',
                    controller: 'TruckController',
                    service: 'ActiveItemService'
                })
                .state('navbar.users', {
                    url: '/users',
                    templateUrl: 'partials/views/users.html',
                    controller: 'UserController'
                })
                .state('navbar.containers', {
                    url: '/containers',
                    templateUrl: 'partials/views/containers.html',
                    controller: 'ContainerController',
                    service: 'ContainerService'
                })
                .state('navbar.containers-user', {
                    url: '/containers-user',
                    templateUrl: 'partials/views/containers-user.html',
                    controller: 'ContainerController',
                    service: 'ActiveItemService'
                });


        });
})();
