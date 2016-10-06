(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'Restangular', 'ActiveItemService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function ContainersController($scope, Restangular, ActiveItemService, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.setActiveObject = setActiveObject;
        $scope.editContainer = editContainer;
        $scope.setContainerToEdit = setContainerToEdit;
        $scope.showDetail = showDetail;
        $scope.deleteContainer = deleteContainer;
        $scope.getContainers = getContainers;
        $scope.activeObject = ActiveItemService.getObject();
        $scope.getContainers();


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

        $scope.defaultMapProperties = {
            center: {
                latitude: 50.0613356,
                longitude: 19.9379844
            },
            zoom: 14
        };

        function setActiveObject(item) {
            $scope.activeObject.coords = item.location;
            $scope.activeObject.id = item.id;
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude;
            $scope.activeObject.options.icon = 'assets/images/ic_map_trash_' + item.type + '.png';
        }

        function setContainerToEdit(container){
            $scope.containerToEdit = container;
        }

        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                $scope.getContainers();
            })
        }


        function deleteContainer(container) {
            Restangular.all('containers').one(container.id).remove().then(function () {
                $scope.getContainers();
            })
        }

        function getContainers() {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
            })
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
