(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('Account', Account);

    Account.$inject = ['Restangular'];

    function Account(Restangular) {
        var service = {
            register: register,
            recover: recover,
            reset: reset,
            update: update,
            changePassword: changePassword
        };

        return service;

        function register(managedUserDTO) {
            return Restangular.all("account").all("register").post(managedUserDTO);
        }

        function recover(email) {
            return Restangular.all("account/reset_password/init").post(email);
        }

        function reset(newPassword, key) {
            return Restangular.all("account/reset_password/finish").post({
                key: key,
                newPassword: newPassword
            })
        }

        function update(managedUserDTO) {
            return Restangular.all("account").post(managedUserDTO);
        }

        function changePassword(newPassword) {
            return Restangular.all("account/change_password").post({
                newPassword: newPassword
            })
        }
    }
})();
