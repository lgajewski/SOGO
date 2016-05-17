'use strict';

// main application module definition
var app = angular.module('wishlist', [
    'ui.router',
    'wishlist.services',
    'wishlist.directives',
    'wishlist.controllers'
]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/users');

    $stateProvider
        .state('users', {
            url: '/users',
            templateUrl: 'partials/views/users.html',
            controller: 'UserController',
            service: 'UsersService'
        });

}).run(function ($rootScope) {
    $rootScope.showView = true;
});