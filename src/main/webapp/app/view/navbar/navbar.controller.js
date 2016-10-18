(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', 'Auth' , 'Restangular'];

    function NavbarController($scope, $rootScope, Auth, Restangular) {
        this.logout = Auth.logout;
        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        function getCurrentUser(){
            Restangular.all('auth').get('user').then(function (resp) {
                $rootScope.currentUser = resp.plain();
            })
        }
        getCurrentUser();
    }


})();
