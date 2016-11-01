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
            isAuthorized: isAuthorized
        };

        return service;

        function isAuthorized() {
            var deferred = $q.defer();

            Restangular.one("authenticate").get()
                .then(function () {
                    deferred.resolve(true);
                })
                .catch(function () {
                    deferred.resolve(false);
                });

            return deferred.promise;
        }

        function authorize() {
            // TODO state redirection
            return true;
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
    }
})();
