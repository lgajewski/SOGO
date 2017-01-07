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
        $scope.repairContainers = repairContainers;
        $scope.trucksNo = 1;
        $scope.containersNo = 5;
        $scope.isTrucksSimulatorRunning = trucksSimulatorState;
        $scope.isContainersSimulatorRunning = containersSimulatorState;

        /** KNOB OPTIONS */
        $scope.trucksKnob = {
            barColor: "#428bca",
            trackColor: "#f2f2f2",
            min: 0,
            max: 15
        };

        $scope.containersKnob = {
            barColor: "#5cb85c",
            trackColor: "#f2f2f2",
            min: 0,
            max: 50
        };

        function createTrucks() {
            Restangular.all('simulator/trucks').customPOST($scope.trucksNo).then(function (data) {
                Notification.success('Trucks created: ' + $scope.trucksNo);
            })
        }

        function emptyTrucks() {
            Restangular.all('simulator/trucks').customPUT().then(function (data) {
                Notification.success('Trucks emptied');
            })
        }

        function createContainers() {
            Restangular.all('simulator/containers').customPOST($scope.containersNo).then(function (data) {
                Notification.success('Containers created: ' + $scope.containersNo);
            })
        }

        function emptyContainers() {
            Restangular.all('simulator/containers').customPUT().then(function (data) {
                Notification.success('Containers emptied');
            })
        }

        function repairContainers() {
            Restangular.all('simulator/containers/repair').customPOST().then(function (data) {
                Notification.success('Containers repaired');
            })
        }

        function simulateTrucks() {
            Restangular.all('simulator/trucks/simulate').customPOST().then(function (data) {
                getTrucksSimulatorState();
            })
        }

        function getTrucksSimulatorState() {
            Restangular.all('simulator/trucks').customGET().then(function (data) {
                $scope.isTrucksSimulatorRunning = data.state;
                Notification('Simulator running:' + $scope.isTrucksSimulatorRunning);
            })
        }

        function simulateContainers() {
            Restangular.all('simulator/containers/simulate').customPOST().then(function (data) {
                getContainersSimulatorState();
            })
        }

        function getContainersSimulatorState() {
            Restangular.all('simulator/containers').customGET().then(function (data) {
                $scope.isContainersSimulatorRunning = data.state;
                Notification('Simulator running:' + $scope.isContainersSimulatorRunning);
            })
        }

        function generateRoutes($event) {
            var b = $(event.currentTarget);
            b.button('loading');
            Restangular.all('routes/generate').customPOST()
                .then(function () {
                    Notification('Routes generated');
                })
                .finally(function () {
                    b.button('reset');
                })
        }

    }
})();
