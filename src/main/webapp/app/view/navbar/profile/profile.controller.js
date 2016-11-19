(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['user', 'Account', 'Notification'];

    function ProfileController(user, Account, Notification) {
        var vm = this;

        vm.alert = null;
        vm.user = user;
        vm.newPassword = null;
        vm.save = save;

        function save() {
            var onSuccess = function () {
                vm.success = true;
                vm.alert = null;
            };

            var onFailure = function (error) {
                vm.success = null;
                vm.alert = error.headers("x-sogo-alert") || "error.unknown";
            };

            // update user
            Account.update(vm.user)
                .then(function () {
                    onSuccess();

                    // change password if necessary
                    if (vm.newPassword) {
                        Account.changePassword(vm.newPassword)
                            .then(onSuccess)
                            .catch(onFailure);
                    }
                })
                .catch(onFailure);
        }
    }
})();
