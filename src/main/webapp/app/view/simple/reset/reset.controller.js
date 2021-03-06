(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ResetController', ResetController);

    ResetController.$inject = ['$stateParams', 'Account'];

    function ResetController($stateParams, Account) {
        var vm = this;

        vm.keyMissing = angular.isUndefined($stateParams.key);

        vm.resetData = {
            password: '',
            repeat: ''
        };

        vm.reset = reset;
        vm.success = false;

        function reset() {
            if (vm.keyMissing) {
                console.error("Attribute key is missing. Try /reset?key=123456");
                return;
            }

            if (vm.resetData.password !== vm.resetData.repeat) {
                vm.success = false;
                vm.error = "error.passwordmismatch";
                return;
            }

            Account.reset(vm.resetData.password, $stateParams.key)
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
