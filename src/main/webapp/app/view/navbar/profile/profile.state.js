(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('profile', {
                    url: '/profile',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/profile/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'vm',
                    resolve: {
                        user: function($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('auth').get('user').then(function (user) {
                                deferred.resolve(user.plain());
                            });

                            return deferred.promise;
                        }
                    }
                })
        })
})();
