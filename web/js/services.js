'use strict';

angular.module('sogo.services',[])

.factory('GreetingService',function($resource) {
    return $resource('http://rest-service.guides.spring.io/greeting');
});