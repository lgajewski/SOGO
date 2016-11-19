(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', 'errorCodes', 'savePropsToVariable',
        'brokenContainers', 'notificationsRead',  'Auth', '$uibModal', 'Restangular', '$q'];

    function NavbarController($scope, $rootScope, errorCodes, savePropsToVariable,
                              brokenContainers, notificationsRead, Auth, $uibModal, Restangular, $q) {
        this.logout = Auth.logout;
        $scope.notificationsRead = notificationsRead;
        $scope.errorsCounter = 0;
        $scope.markAsRead = markAsRead;
        $scope.errorCodeDescriptions = errorCodes;
        $scope.brokenContainers = brokenContainers;
        $rootScope.propsInVariable = savePropsToVariable;

        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        // $(function () {
        //     var navMain = $("#nav-main");
        //     navMain.on("click", "a", null, function () {
        //         navMain.collapse('hide');
        //     });
        // });

        function markAsRead(container){
            var index = $scope.brokenContainers.indexOf(container);
            if(!sessionStorage.notificationsRead){
                sessionStorage.notificationsRead = [];
            }
            if(index > -1) {
                $scope.brokenContainers.splice(index, 1);
                $scope.notificationsRead.push(container);
                sessionStorage.setItem("notificationsRead", JSON.stringify($scope.notificationsRead));
            }
        }

        $scope.animationsEnabled = true;

        $scope.openServiceAlertsModal = function(){
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'myServiceAlertsModalLabel',
                templateUrl: 'app/view/navbar/home/alerts/serviceAlertsModal.html',
                controller: 'AlertsController',
                resolve: {
                    brokenContainers: function(){
                        var deferred = $q.defer();
                        var broken = [];
                        Restangular.all('containers').getList().then(function (resp) {
                            var num;
                            for (var i = 0; i < resp.length; i++) {
                                num = parseInt((parseFloat(resp[i].sensors.load.value))/10);

                                var container = {
                                    id: 0,
                                    coords: {},
                                    address: "",
                                    capacity: 0,
                                    load: 0,
                                    type: "",
                                    sensors: {},
                                    options: {
                                        draggable: false,
                                        icon: {
                                            url: 'assets/images/trash' + num + '_' + resp[i].type + '.png',
                                            scaledSize: {width: 30, height: 30}
                                        }
                                    }
                                };
                                container.sensors = resp[i].sensors;

                                if(isError(container)){
                                    container.options.icon.url = 'assets/images/trash_' + resp[i].type + '_error.png';
                                    container.id = resp[i].id;
                                    // if(resp[i].location){
                                    container.coords.latitude = resp[i].location.latitude;
                                    container.coords.longitude = resp[i].location.longitude;
                                    // }
                                    container.address = resp[i].address;
                                    container.type = resp[i].type;
                                    container.capacity = resp[i].capacity;
                                    container.load = parseFloat(resp[i].sensors.load.value).toFixed(2);
                                    broken.push(container);

                                }
                            }
                            deferred.resolve(broken);
                        });
                        return deferred.promise;
                    }
                }
            });

            modalInstance.result.then(function () {
                console.log('Modal ??? at: ' + new Date());
            }, function () {
                getContainers();
                console.log('Modal dismissed at: ' + new Date());
            });

            function isError(container){
                for(var sensor in container.sensors){
                    if(container.sensors[sensor].errorCode != 0){
                        return true;
                    }
                }
                return false;
            }
        };




    }
})();
