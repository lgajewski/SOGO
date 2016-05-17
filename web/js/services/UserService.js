'use strict';

services.service('UserService', ['RestService', function (RestService) {

    var service = {};

    service.getUsers = RestService.getFunctionFactory('/users');
    service.getUser = RestService.getFunctionFactory('/{username}');
    service.updateUser = RestService.putFunctionFactory('/{username}');

    return service;
}]);

//services.factory('UserService', function ($resource) {
//    return $resource('/:username', {}, {
//        getUser: {
//            method: 'GET'
//        },
//        updateUser: {
//            method: 'PUT'
//        }
//    })
//});