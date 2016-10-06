(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$scope', 'Restangular', 'ActiveItemService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function TrucksController($scope, Restangular, ActiveItemService, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.getTrucks = getTrucks;
        $scope.deleteTruck = deleteTruck;
        $scope.addTruck = addTruck;
        $scope.showDetail = showDetail;
        $scope.setActiveObject = setActiveObject;
        $scope.setTruckToEdit = setTruckToEdit;
        $scope.editTruck = editTruck;

        $scope.getTrucks();

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5).notSortable()
        ];

        $scope.activeObject = ActiveItemService.getObject();

        $scope.defaultMapProperties = {
            center: {
                latitude: 50.0613356,
                longitude: 19.9379844
            },
            zoom: 14
        };


        function addTruck(truck){
            // TO DO - setting location
            truck.location = {};
            truck.location.latitude = $scope.defaultMapProperties.center.latitude;
            truck.location.longitude = $scope.defaultMapProperties.center.longitude;
            Restangular.all('trucks').customPOST(truck).then(function () {
                $scope.getTrucks();
            })
        }
        function getTrucks() {
            Restangular.all('trucks').getList().then(function (data) {
                $scope.items = data;
                console.log($scope.items[0])
            })
        }
        function setActiveObject(item) {
            $scope.activeObject.id = item.id;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.options.icon = 'assets/images/truck.png';
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude
        }

        function editTruck(truck){
            Restangular.all('trucks').customPUT(truck).then(function () {
                $scope.getTrucks();
            })
        }

        function deleteTruck(truck) {
            Restangular.all('trucks').one(truck.registration).remove().then(function () {
                $scope.getTrucks();
            })
        }

        function setTruckToEdit(truck){
            $scope.truckToEdit = truck;
        }

        function showDetail(item) {
            if ($scope.active != item.id) {
                $scope.active = item.id;
            }
            else {
                $scope.active = null;
            }
        }

    }

})();
