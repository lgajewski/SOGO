(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ResetController', ResetController);

    ResetController.$inject = ['Auth'];

    function ResetController(Auth) {
        var vm = this;

        vm.resetData = {
            login: '',
            password: '',
            repeat: ''
        };

        vm.reset = reset;
        vm.success = false;

        function reset() {
            if (vm.resetData.password !== vm.resetData.repeat) {
                vm.success = false;
                vm.error = "error.passwordmismatch";
                return;
            }

            Auth.reset(vm.resetData.login, vm.resetData.password)
                .then(function () {
                    vm.success = true;

                    vm.error = null;
                }).catch(function (error) {
                vm.error = error.headers("x-sogo-alert") || error.data.message || "Please try again";
            });
        }
    }
})();
