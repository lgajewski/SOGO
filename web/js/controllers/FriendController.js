'use strict';

controllers.controller('FriendController', function ($scope, $http, FriendService) {
    $scope.friends = {};
    $scope.friend = {};

    $scope.getFriends = function(){
        FriendService.getFriends().then(function (friends) {
            console.log(friends);
            $scope.friends = friends;
        }, function (err) {
            console.log("getFriends ERROR ", err);
        });
    };

    $scope.addFriend = function (friend) {
        FriendService.addFriend(friend).then(function () {
            $scope.friend = '';
        }, function (err) {
            console.log("addFriend ERROR ", err);
        });
    };

    $scope.deleteFriend= function (friend) {
        FriendService.deleteFriend(friend).then(function () {
            //TODO
            //console.log(gift);
            //$scope.gift = gift;
        }, function (err) {
            console.log("deleteFriend ERROR ", err);
        });
    };

});