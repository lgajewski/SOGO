(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('Auth', Auth);

    Auth.$inject = ['$q', '$localStorage', 'Restangular'];

    function Auth($q, $localStorage, Restangular) {
        var service = {
            login: login,
            authorize: authorize
        };

        return service;

        // function getToken () {
        //     return $localStorage.authenticationToken;
        // }

        // function hasValidToken () {
        //     var token = this.getToken();
        //     return !!token;
        // }

        function authorize() {
            var deferred = $q.defer();

            console.log("authorize()");
            setTimeout(function() {
                console.log("after timeout");
                deferred.resolve("123");
            }, 500);

            return deferred.promise;
        }

        function login(credentials) {
            var deferred = $q.defer();

            var data = 'username=' + encodeURIComponent(credentials.username) +
                '&password=' + encodeURIComponent(credentials.password) + '&submit=Login';

            Restangular.all("authentication").post(data, undefined, {'Content-Type': "application/x-www-form-urlencoded"})
                .then(function() {
                    console.log("LOGGED IN");
                    deferred.resolve();
                })
                .catch(function() {
                    console.log("ERROR DURING LOGIN!");
                    deferred.reject();
                });
            // $http.post('api/authentication', data, {
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     }
            // }).success(function (response) {
            //     return response;
            // });

            // AuthServerProvider.login(credentials)
            //     .then(loginThen)
            //     .catch(function (err) {
            //         this.logout();
            //         deferred.reject(err);
            //         return cb(err);
            //     }.bind(this));
            //
            // function loginThen(data) {
            //     Principal.identity(true).then(function (account) {
            //         JhiTrackerService.sendActivity();
            //         deferred.resolve(data);
            //     });
            //     return cb();
            // }

            return deferred.promise;
        }

/*        function logout () {
            JhiTrackerService.disconnect();


            // logout from the server
            $http.post('api/logout').success(function (response) {
                delete $localStorage.authenticationToken;
                // to get a new csrf token call the api
                $http.get('api/account');
                return response;
            });

        }*/
    }

})();
    /*
    Auth.$inject = ['$rootScope', '$state', '$sessionStorage', '$q', 'Principal', 'AuthServerProvider', 'Account', 'LoginService', 'Register', 'Activate', 'Password', 'PasswordResetInit', 'PasswordResetFinish', 'JhiTrackerService'];

    function Auth($rootScope, $state, $sessionStorage, $q, Principal, AuthServerProvider, Account, LoginService, Register, Activate, Password, PasswordResetInit, PasswordResetFinish, JhiTrackerService) {
        var service = {
            activateAccount: activateAccount,
            authorize: authorize,
            changePassword: changePassword,
            createAccount: createAccount,
            getPreviousState: getPreviousState,
            login: login,
            logout: logout,
            resetPasswordFinish: resetPasswordFinish,
            resetPasswordInit: resetPasswordInit,
            resetPreviousState: resetPreviousState,
            storePreviousState: storePreviousState,
            updateAccount: updateAccount
        };

        return service;

        function activateAccount(key, callback) {
            var cb = callback || angular.noop;

            return Activate.get(key,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }

        function authorize(force) {
            var authReturn = Principal.identity(force).then(authThen);

            return authReturn;

            function authThen() {
                var isAuthenticated = Principal.isAuthenticated();

                // an authenticated user can't access to login and register pages
                if (isAuthenticated && $rootScope.toState.parent === 'account' && ($rootScope.toState.name === 'login' || $rootScope.toState.name === 'register')) {
                    $state.go('home');
                }

                // recover and clear previousState after external login redirect (e.g. oauth2)
                if (isAuthenticated && !$rootScope.fromState.name && getPreviousState()) {
                    var previousState = getPreviousState();
                    resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }

                if ($rootScope.toState.data.authorities && $rootScope.toState.data.authorities.length > 0 && !Principal.hasAnyAuthority($rootScope.toState.data.authorities)) {
                    if (isAuthenticated) {
                        // user is signed in but not authorized for desired state
                        $state.go('accessdenied');
                    }
                    else {
                        // user is not authenticated. stow the state they wanted before you
                        // send them to the login service, so you can return them when you're done
                        storePreviousState($rootScope.toState.name, $rootScope.toStateParams);

                        // now, send them to the signin state so they can log in
                        $state.go('accessdenied').then(function () {
                            LoginService.open();
                        });
                    }
                }
            }
        }

        function changePassword(newPassword, callback) {
            var cb = callback || angular.noop;

            return Password.save(newPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function createAccount(account, callback) {
            var cb = callback || angular.noop;

            return Register.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    this.logout();
                    return cb(err);
                }.bind(this)).$promise;
        }

        function login(credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServerProvider.login(credentials)
                .then(loginThen)
                .catch(function (err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

            function loginThen(data) {
                Principal.identity(true).then(function (account) {
                    JhiTrackerService.sendActivity();
                    deferred.resolve(data);
                });
                return cb();
            }

            return deferred.promise;
        }


        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        }

        function resetPasswordFinish(keyAndPassword, callback) {
            var cb = callback || angular.noop;

            return PasswordResetFinish.save(keyAndPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function resetPasswordInit(mail, callback) {
            var cb = callback || angular.noop;

            return PasswordResetInit.save(mail, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function updateAccount(account, callback) {
            var cb = callback || angular.noop;

            return Account.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }

        function getPreviousState() {
            var previousState = $sessionStorage.previousState;
            return previousState;
        }

        function resetPreviousState() {
            delete $sessionStorage.previousState;
        }

        function storePreviousState(previousStateName, previousStateParams) {
            var previousState = {"name": previousStateName, "params": previousStateParams};
            $sessionStorage.previousState = previousState;
        }
    }
})();
*/
