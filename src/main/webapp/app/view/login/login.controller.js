(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$timeout', 'Auth'];

    function LoginController($state, $timeout, Auth) {
        var vm = this;

        vm.authenticationError = false;
        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.rememberMe = true;
        vm.requestResetPassword = requestResetPassword;
        vm.username = null;

        $timeout(function () {
            angular.element('#username').focus();
        });

        function cancel() {
            vm.credentials = {
                username: null,
                password: null
            };
            vm.authenticationError = false;
        }

        function login() {
            Auth.login({
                username: vm.username,
                password: vm.password
            }).then(function () {
                vm.authenticationError = false;

                $state.go('navbar.home')
            }).catch(function () {
                vm.authenticationError = true;
            });
        }

        function register() {
            $state.go('register');
        }

        function requestResetPassword() {
            $state.go('requestReset');
        }
    }
})();
