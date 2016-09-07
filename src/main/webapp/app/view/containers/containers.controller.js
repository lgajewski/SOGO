(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'Restangular', 'ActiveItemService'];

    function ContainersController($scope, Restangular, ActiveItemService) {
        $scope.activeObject = ActiveItemService.getObject();
        $scope.setActiveObject = function (item) {
            $scope.activeObject.id = item.id;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.options.icon = 'assets/images/ic_map_trash_' + item.type + '.png';
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude

        };


        $scope.deleteContainer = function (container) {
            Restangular.all('containers').one(container.id).remove().then(function () {
                $scope.getContainers();
            })
        };

        $scope.getContainers = function () {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
                console.log(data);
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
