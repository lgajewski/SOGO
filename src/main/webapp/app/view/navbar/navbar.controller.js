(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', '$http', 'SseService', 'Auth' , 'Restangular'];

    function NavbarController($scope, $rootScope, $http, SseService, Auth, Restangular) {
        this.logout = Auth.logout;
        $scope.brokenContainers = [];
        $scope.errorsCounter = 0;
        configureSse();
        getCurrentUser();
        errorCodes();
        loadContainers();

        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        function configureSse() {
            var onContainerUpdated = function (event) {
                var updatedContainer = JSON.parse(event.data);

                $scope.$apply(function () {
                    // var updatedContainer = JSON.parse(event.data);
                    var container = $scope.brokenContainers.find(c => c.id === updatedContainer.id);
                    if (container) {
                        container.address = updatedContainer.address;
                        container.type = updatedContainer.type;
                        container.sensors = updatedContainer.sensors;
                    }
                });
            };

            // register
            SseService.register("container", onContainerUpdated);

            // unregister on exit
            $scope.$on("$destroy", function () {
                SseService.unregister(onContainerUpdated);
            });
        }

        function getCurrentUser(){
            Restangular.all('auth').get('user').then(function (resp) {
                $rootScope.currentUser = resp.plain();
            })
        }

        function loadContainers() {
            $scope.brokenContainers = [];
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
                        if(container.sensors[sensor].errorCode > 0)
                            var errorMessage = {
                                sensor: sensor,
                                errorCode: container.sensors[sensor].errorCode,
                                message: $scope.errorCodeDesciptions[container.sensors[sensor].errorCode]
                            };
                        container.errorMessages.push(errorMessage);
                    }
                    $scope.brokenContainers.push(container);

                }
            })
        }

        function errorCodes() {
            $http.get('resources/errorcodes.properties').then(function (response) {
                $scope.errorCodeDesciptions = response.data;
            });
        }
    }
})();
