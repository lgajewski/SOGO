'use strict';

controllers.controller('UserController', function ($scope, $http, UserService) {
    $scope.users = {};
    $scope.user = {};

    $scope.getUsers = function(){
        UserService.getUsers().then(function (users) {
            console.log(users);
            $scope.users = users;
        }, function (err) {
            console.log("getUsers ERROR ", err);
        });
    };

    $scope.getUser = function () {
        UserService.getUser().then(function (user) {
            console.log(user);
            $scope.user = user;
        }, function (err) {
            console.log("getUser ERROR ", err);
        });
    };

    $scope.updateUser = function (user) {
        UserService.updateUser(user).then(function (user) {
            console.log(user);
            $scope.user = user;
        }, function (err) {
            console.log("updateUser ERROR ", err);
        });
    };

});

//controllers.controller('UserController', ['$scope', '$dialogs', 'UsersService',
//    function ($scope, $dialogs, UsersService) {
//
//        $scope.data = {};
//
//        getUsers();
//
//        var getUsers = function () {
//
//            UsersService.getUsers(function (successResult) {
//                $scope.users = successResult;
//            },
//            function (errorResult) {
//                $dialogs.error("Error occurred!", errorResult.data.error);
//            }
//        );
//    };
//}]);