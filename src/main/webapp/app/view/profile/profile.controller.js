(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$rootScope', 'Restangular'];

    function ProfileController($scope, $rootScope, Restangular) {
        $scope.updateUser = updateUser;
        getCurrentUser();


        function getCurrentUser(){
            Restangular.all('auth').get('user').then(function (resp) {
                $scope.currentUser = resp.plain();
                $rootScope.currentUser = $scope.currentUser;
            })
        }

        function updateUser(){
            console.log($scope.currentUser);
            Restangular.all('users/self').customPUT($scope.currentUser).then(function (resp) {
                getCurrentUser();
            })
        }

    }

})();
