'use strict';

services.service('FriendService', ['RestService', function (RestService) {

    var service = {};

    service.getFriends = RestService.getFunctionFactory('/getAll/{id}');
    service.addFriend = RestService.postFunctionFactory('/add/{userId}');
    service.deleteFriend = RestService.deleteFunctionFactory('/delete/{userId}');

    return service;
}]);
