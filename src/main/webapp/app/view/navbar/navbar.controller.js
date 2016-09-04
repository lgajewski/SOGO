(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['Auth'];

    function NavbarController(Auth) {
        this.logout = Auth.logout;
    }
      
})();
