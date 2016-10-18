(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'Restangular'];

    function ProfileController($scope, Restangular) {
        $scope.updateUser = updateUser;
        getCurrentUser();


        function getCurrentUser(){
            Restangular.all('auth').get('user').then(function (resp) {
                $scope.currentUser = resp.plain();
            })
        }

        function updateUser(){
            Restangular.all('users').customPUT($scope.currentUser).then(function (response) {
                getCurrentUser();
            })
        }

    }

})();
