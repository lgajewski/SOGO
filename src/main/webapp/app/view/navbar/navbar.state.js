(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('navbar', {
                    abstract: true,
                    parent: 'app',
                    templateUrl: 'app/view/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm',
                    resolve: {
                        errorCodes: function($q, $http) {
                            var deferred = $q.defer();
                            $http.get('resources/errorcodes.properties').then(function (response) {
                                var errorCodeDescriptions = response.data;
                                deferred.resolve(errorCodeDescriptions);
                            });
                            return deferred.promise;
                        },
                        currentUser: function($q, Restangular) {
                            var deferred = $q.defer();
                            Restangular.all('auth').get('user').then(function (resp) {
                                var currentUser = resp.plain();
                                deferred.resolve(currentUser);
                            });

                            return deferred.promise;
                        },
                        notificationsRead: function($q){
                            var deferred = $q.defer();
                            var itemName = "notificationsRead";
                            if(sessionStorage.getItem(itemName) == null){
                                sessionStorage.setItem(itemName, JSON.stringify([]));
                            }
                            deferred.resolve(JSON.parse(sessionStorage.getItem(itemName)));
                            return deferred.promise;
                        },
                        brokenContainers: function($q, Restangular, errorCodes, notificationsRead) {
                            var deferred = $q.defer();
                            var brokenContainers = [];
                            Restangular.all('containers').getList().then(function (resp) {
                                for (var i = 0; i < resp.length; i++) {
                                    var container = {
                                        id: 0,
                                        address: {},
                                        type: "",
                                        sensors: {},
                                        errorMessages: []
                                    };
                                    container.id = resp[i].id;
                                    container.type = resp[i].type;
                                    container.sensors = resp[i].sensors;
                                    container.address = resp[i].address;
                                    for(var sensor in container.sensors){
                                        if(container.sensors[sensor].errorCode > 0){
                                            var errorMessage = {
                                                sensor: sensor,
                                                errorCode: container.sensors[sensor].errorCode,
                                                message: errorCodes[container.sensors[sensor].errorCode]
                                            };
                                            container.errorMessages.push(errorMessage);
                                        }
                                    }

                                    if(container.errorMessages.length > 0 && JSON.parse(sessionStorage.getItem("notificationsRead")).map(function(v){
                                            return v.id;
                                        }).indexOf(container.id) < 0) {

                                        brokenContainers.push(container);
                                    }

                                }
                                deferred.resolve(brokenContainers);
                            });
                            return deferred.promise;
                        }
                    }
                })
        })
})();
