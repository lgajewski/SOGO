(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('Auth', Auth);

    Auth.$inject = ['$q', '$state', 'Restangular'];

    function Auth($q, $state, Restangular) {
        var service = {
            login: login,
            logout: logout,
            authorize: authorize,
            register: register,
            recover: recover,
            reset: reset
        };

        return service;

        function authorize() {
            var deferred = $q.defer();

            Restangular.one("authenticate").get()
                .then(function () {
                    $state.go('navbar.home');
                })
                .catch(function () {
                    deferred.resolve();
                });

            return deferred.promise;
        }

        function login(credentials) {
            var data = 'username=' + encodeURIComponent(credentials.username) +
                '&password=' + encodeURIComponent(credentials.password) + '&submit=Login';

            return Restangular.all("authentication").post(data, undefined, {'Content-Type': "application/x-www-form-urlencoded"});
        }

        function logout() {
            // logout from the server
            return Restangular.all("logout").post();
        }

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
    }
})();
