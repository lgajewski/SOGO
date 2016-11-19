(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('SimulatorController', SimulatorController);

    SimulatorController.$inject = ['$scope', 'trucksSimulatorState',
        'containersSimulatorState', 'Restangular', 'Notification'];

    function SimulatorController($scope, trucksSimulatorState, containersSimulatorState,
                                 Restangular, Notification) {
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
                Notification.success('Trucks created: '+ $scope.trucksNo);
                $scope.trucksNo = 1;
            })
        }

        function emptyTrucks(){
            Restangular.all('simulator/trucks').customPUT().then(function (data) {
                Notification.success('Trucks emptied');
            })
        }

        function createContainers(){
            Restangular.all('simulator/containers').customPOST($scope.containersNo).then(function (data) {
                Notification.success('Containers created: '+ $scope.containersNo);
                $scope.containersNo = 1;
            })
        }

        function emptyContainers(){
            Restangular.all('simulator/containers').customPUT().then(function (data) {
                Notification.success('Containers emptied');
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
                Notification('Simulator running:' + $scope.isTrucksSimulatorRunning);
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
                Notification('Simulator running:' + $scope.isContainersSimulatorRunning);
            })
        }

        function generateRoutes(){
            Restangular.all('routes/generate').customPOST()
                .then(function (response) {
                    Notification('Routes generated');
                })
        }

    }
})();
