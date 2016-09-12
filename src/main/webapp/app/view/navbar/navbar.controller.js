(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Auth'];

    function NavbarController($scope, Auth) {
        this.logout = Auth.logout;
        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });
    }

})();
