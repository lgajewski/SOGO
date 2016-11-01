(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['Account'];

    function SignupController(Account) {
        var vm = this;

        vm.account = {
            login: '',
            password: '',
            repeat: '',
            firstName: '',
            lastName: '',
            email: '',
            authorities: []
        };

        vm.signup = signup;
        vm.success = false;

        function signup() {
            if (vm.account.password !== vm.account.repeat) {
                vm.success = false;
                vm.error = "error.passwordmismatch";
                return;
            }

            Account.register(vm.account)
                .then(function () {
                    vm.success = true;

                    vm.error = null;
                })
                .catch(function (error) {
                    vm.error = error.headers("x-sogo-alert") || "error.unknown";
                });
        }
    }
})();
