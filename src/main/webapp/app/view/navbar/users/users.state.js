(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('users', {
                    url: '/users',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/users/users.html',
                    controller: 'UsersController',
                    resolve: {
                        authorities: function($q, Restangular) {
                            var deferred = $q.defer();

                            Restangular.all('users/authorities').getList().then(function (data) {
                                var authorities = [];
                                for(var i=0;i<data.length;i++){
                                    authorities.push(data[i])
                                }

                                deferred.resolve(authorities);
                            });
                            return deferred.promise;
                        }
                    }

                })
        })
})();
