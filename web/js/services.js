'use strict';

angular.module('sogo.services',[])

    .factory('GreetingService',function($resource) {
        return $resource('http://rest-service.guides.spring.io/greeting');
    })

    .factory('ContainerService',function($resource) {
        return $resource('http://localhost/containers');
    })
    .factory('TruckService',function($resource) {
        return $resource('http://localhost/trucks');
    })
    .factory('UserService',function($resource) {
        return $resource('http://localhost/users');
    });


