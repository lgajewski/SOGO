(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'Restangular', 'ActiveItemService', '$compile', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function ContainersController($scope, Restangular, ActiveItemService, $compile, DTOptionsBuilder, DTColumnDefBuilder) {
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


        $scope.setActiveObject = setActiveObject;
        $scope.editContainer = editContainer;
        $scope.setContainerToEdit = setContainerToEdit;
        $scope.activeObject = ActiveItemService.getObject();

        function setActiveObject(item) {
            // $scope.activeObject.capacity = item.capacity;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.id = item.id;
            // $scope.activeObject.load = item.sensors.load.value;
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude;
            $scope.activeObject.options.icon = 'assets/images/ic_map_trash_' + item.type + '.png';
            // $scope.activeObject.type = item.type;
            console.log($scope.activeObject);

        };

        function setContainerToEdit(container){
            $scope.containerToEdit = container;
        }

        $scope.defaultMapProperties = {
            center: {
                latitude: 50.0613356,
                longitude: 19.9379844
            },
            zoom: 14
        };


        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                $scope.getContainers();
            })
        }


        $scope.deleteContainer = function (container) {
            Restangular.all('containers').one(container.id).remove().then(function () {
                $scope.getContainers();
            })
        };

        $scope.getContainers = function () {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
                console.log($scope.items[0]);
            })
        };
        $scope.getContainers();
        $scope.showDetail = function (item) {
            if ($scope.active != item.id) {
                $scope.active = item.id;
            }
            else {
                $scope.active = null;
            }
        };

    }

})();
