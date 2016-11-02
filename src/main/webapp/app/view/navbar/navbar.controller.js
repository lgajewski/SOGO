(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', '$http', 'Auth' , 'Restangular'];

    function NavbarController($scope, $rootScope, $http, Auth, Restangular) {
        this.logout = Auth.logout;
        $scope.brokenContainers = [];
        $scope.errorsCounter = 0;
        getCurrentUser();
        errorCodes();
        loadContainers();

        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        $(function () {
            var navMain = $("#nav-main");
            navMain.on("click", "a", null, function () {
                navMain.collapse('hide');
            });
        });

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
                        if(container.sensors[sensor].errorCode > 0){
                            var errorMessage = {
                                sensor: sensor,
                                errorCode: container.sensors[sensor].errorCode,
                                message: $scope.errorCodeDesciptions[container.sensors[sensor].errorCode]
                            };
                            container.errorMessages.push(errorMessage);
                        }
                    }

                    if(container.errorMessages.length > 0){
                        $scope.brokenContainers.push(container);
                    }

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
