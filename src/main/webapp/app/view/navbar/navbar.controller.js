(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Auth' , 'Restangular'];

    function NavbarController($scope, Auth, Restangular) {
        this.logout = Auth.logout;
        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        function getCurrentUser(){
            Restangular.all('auth').get('user').then(function (resp) {
                $scope.currentUser = resp.plain();
            })
        }
        getCurrentUser();
    }


})();
