'use strict';

services.service('GiftService', ['RestService', function (RestService) {

    var service = {};

    service.getGifts = RestService.getFunctionFactory('/forUser/{userId}');
    service.getGift = RestService.getFunctionFactory('/getGift/{id}');
    service.addGift = RestService.postFunctionFactory('/add/{userId}');
    service.updateGift = RestService.putFunctionFactory('/update/{id}');
    service.removeGift = RestService.deleteFunctionFactory('/remove/{userId}/{giftId}');

    return service;
}]);
