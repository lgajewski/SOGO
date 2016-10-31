(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$timeout', 'Auth', 'Account'];

    function LoginController($state, $timeout, Auth, Account) {
        var vm = this;

        vm.recoveryEmail = null;
        vm.recover = recover;

        vm.alert = {
            authentication: null,
            recovery: null
        };

        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.username = null;

        $timeout(function () {
            angular.element('#username').focus();
        });

        function cancel() {
            vm.credentials = {
                username: null,
                password: null
            };
            vm.alert.authentication = null;
        }

        function login() {
            Auth.login({
                username: vm.username,
                password: vm.password
            }).then(function () {
                vm.alert.authentication = null;

                $state.go('navbar.home')
            }).catch(function (error) {
                vm.alert.authentication = error.headers("x-sogo-alert") || error.data.message || "Please try again";
            });
        }

        function register() {
            $state.go('register');
        }

        function recover() {
            Account.recover(vm.recoveryEmail)
                .then(function () {
                    vm.alert.recovery = null;
                }).catch(function (error) {
                    vm.alert.recovery = error.headers("x-sogo-alert") || error.data.message || "Please try again";
            });

            // dismiss modal
            $('.forget-modal').modal('hide');
        }
    }
})();
