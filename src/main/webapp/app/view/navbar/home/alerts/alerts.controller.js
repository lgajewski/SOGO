(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('AlertsController', AlertsController);

    AlertsController.$inject = ['$scope', 'Restangular', 'brokenContainers', 'Notification', '$uibModal'];

    function AlertsController($scope, Restangular, brokenContainers, Notification, $uibModal) {

        $scope.editContainer = editContainer;
        $scope.brokenContainers = brokenContainers;


        function editContainer(container) {
            Restangular.all('containers').customPUT(container).then(function () {
                Notification.success('Container ' + container.id + ' edited');
                // $scope.getContainers();

            })
        }

        function getContainers() {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
                for (var i = 0; i < $scope.items.length; i++) {
                    $scope.items[i].sensors.load.value = parseFloat($scope.items[i].sensors.load.value);
                }

            });
        }

        $scope.openContainerStatusModal = function (containerToEdit) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'myContainerStatusModalLabel',
                templateUrl: 'app/view/navbar/containers/status/containerStatusModal.html',
                controller: 'StatusController',
                resolve: {
                    containerToEdit: function () {
                        return containerToEdit;
                    },
                    repairers: function($q, Restangular) {
                        var deferred = $q.defer();
                        Restangular.all('users/ROLE_USER').getList().then(function (data) {
                            var repairers = [null];
                            for(var i=0; i<data.length;i++){
                                repairers.push(data[i]);
                            }
                            deferred.resolve(repairers);
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
        };
    }
})();
