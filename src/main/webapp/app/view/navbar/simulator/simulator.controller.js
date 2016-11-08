(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('SimulatorController', SimulatorController);

    SimulatorController.$inject = ['$scope', 'Restangular'];

    function SimulatorController($scope, Restangular) {
        $scope.getTrucksSimulatorState = getTrucksSimulatorState;
        $scope.simulateTrucks = simulateTrucks;
        $scope.getContainersSimulatorState = getContainersSimulatorState;
        $scope.simulateContainers = simulateContainers;
        $scope.generateRoutes = generateRoutes;
        $scope.createTrucks = createTrucks;
        $scope.createContainers = createContainers;
        $scope.trucksNo = 1;
        $scope.containersNo = 1;

        getTrucksSimulatorState();
        getContainersSimulatorState();

        function createTrucks(){
            Restangular.all('simulator/trucks').customPOST($scope.trucksNo).then(function (data) {
                $scope.trucksNo = 1;
            })
        }

        function createContainers(){
            Restangular.all('simulator/containers').customPOST($scope.containersNo).then(function (data) {
                $scope.containersNo = 1;
            })
        }


        function simulateTrucks(){
            Restangular.all('simulator/trucks/simulate').customPOST().then(function (data) {
                getTrucksSimulatorState();
            })
        }

        function getTrucksSimulatorState(){
            Restangular.all('simulator/trucks').customGET().then(function (data) {
                $scope.isTrucksSimulatorRunning = data.state;
            })
        }

        function simulateContainers(){
            Restangular.all('simulator/containers/simulate').customPOST().then(function (data) {
                getContainersSimulatorState();
            })
        }

        function getContainersSimulatorState(){
            Restangular.all('simulator/containers').customGET().then(function (data) {
                $scope.isContainersSimulatorRunning = data.state;
            })
        }

        function generateRoutes(){
            Restangular.all('routes/generate').customPOST().then(function (data) {

            })
        }
    }
})();
