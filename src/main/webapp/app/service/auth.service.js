(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('Auth', Auth);

    Auth.$inject = ['$rootScope', '$q', '$state', 'Restangular'];

    function Auth($rootScope, $q, $state, Restangular) {
        return {
            login: login,
            logout: logout,
            authorize: authorize,
            isAuthenticated: isAuthenticated,
            getUser: getUser
        };

        function isAuthenticated() {
            var deferred = $q.defer();

            Restangular.one("auth/authenticate").get()
                .then(function () {
                    deferred.resolve(true);
                })
                .catch(function () {
                    deferred.resolve(false);
                });

            return deferred.promise;
        }

        function authorize() {
            Restangular.one("auth/authenticate").get()
                .then(function () {
                    // authenticated user can't access login and register pages
                    if ($rootScope.toState.parent === 'simple') {
                        $state.go('home');
                    }
                })
                .catch(function () {
                    // user isn't authenticated, redirect to login page
                    if ($rootScope.toState.parent === 'navbar') {
                        $state.go('login');
                    }
                });
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

        function getUser() {
            return Restangular.one("auth/user").get();
            // return $rootScope.currentUser;
        }
    }
})();
