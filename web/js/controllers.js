'use strict';

/* Controllers */

angular.module('sogo.controllers', [])

.controller('GreetingController',function($scope,$state, GreetingService) {

    $scope.greeting = GreetingService.get();
    
});