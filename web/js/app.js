'use strict';

// main application module definition
angular.module('sogo', [
    'ui.router',
    'ngResource',
    'sogo.services',
    'sogo.directives',
    'sogo.controllers',
    'restangular',
    'uiGmapgoogle-maps'
])

    .config(function(RestangularProvider) {
        //set the base url for api calls on our RESTful services
        var newBaseUrl = "http://localhost/";
        RestangularProvider.setBaseUrl(newBaseUrl);
    })
    .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
       key: 'AIzaSyB5nmqhScXjuLEpFhwwszBVsKmb2OWSoQ4',
        libraries: 'weather,geometry,visualization'
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/login');

    $urlRouterProvider.otherwise(function($injector, $location) {
        $injector.invoke(['$state', function($state) {
            $state.go('404');
        }]);
    }); 

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
        .state('login', {
            url: '/login',
            templateUrl: 'partials/views/login.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'partials/views/signup.html'
        })
        .state('navbar', {
            templateUrl: 'partials/views/navbar.html'
        })
        .state('navbar.home', {
            url: '/home',
            templateUrl: 'partials/views/home.html',
            controller: 'HomeController'
        })
        .state('navbar.trucks', {
            url: '/trucks',
            templateUrl: 'partials/views/trucks.html',
            controller: 'TruckController',
            service: 'TruckService'
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
        });



}).run(function ($state) {
   $state.go('login');
});