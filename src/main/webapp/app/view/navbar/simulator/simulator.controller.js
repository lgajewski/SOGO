(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('SimulatorController', SimulatorController);

    SimulatorController.$inject = ['$scope', 'trucksSimulatorState', 'containersSimulatorState', 'Restangular'];

    function SimulatorController($scope, trucksSimulatorState, containersSimulatorState, Restangular) {
        $scope.getTrucksSimulatorState = getTrucksSimulatorState;
        $scope.simulateTrucks = simulateTrucks;
        $scope.getContainersSimulatorState = getContainersSimulatorState;
        $scope.simulateContainers = simulateContainers;
        $scope.generateRoutes = generateRoutes;
        $scope.createTrucks = createTrucks;
        $scope.emptyTrucks = emptyTrucks;
        $scope.createContainers = createContainers;
        $scope.emptyContainers = emptyContainers;
        $scope.trucksNo = 1;
        $scope.containersNo = 1;
        $scope.isTrucksSimulatorRunning = trucksSimulatorState;
        $scope.isContainersSimulatorRunning = containersSimulatorState;

        function createTrucks(){
            Restangular.all('simulator/trucks').customPOST($scope.trucksNo).then(function (data) {
                $scope.trucksNo = 1;
            })
        }

        function emptyTrucks(){
            Restangular.all('simulator/trucks').customPUT().then(function (data) {
            })
        }

        function createContainers(){
            Restangular.all('simulator/containers').customPOST($scope.containersNo).then(function (data) {
                $scope.containersNo = 1;
            })
        }

        function emptyContainers(){
            Restangular.all('simulator/containers').customPUT().then(function (data) {
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
