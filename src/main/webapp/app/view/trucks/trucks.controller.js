(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$scope', 'Restangular', 'ActiveItemService'];

    function TrucksController($scope, Restangular, ActiveItemService) {

        $scope.activeObject = ActiveItemService.getObject();
        $scope.setActiveObject = function (item) {
            $scope.activeObject.id = item.id;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.options.icon = 'assets/images/truck.png';
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude

        };
        $scope.getTrucks = function () {
            Restangular.all('trucks').getList().then(function (data) {
                $scope.items = data;
            })
        };
        $scope.getTrucks();

        $scope.deleteTruck = function (truck) {
            Restangular.all('trucks').one(truck.registration).remove().then(function () {
                $scope.getTrucks();
            })
        };

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
