(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Restangular', 'SseService', 'DirectionsService'];

    function HomeController($scope, Restangular, SseService, DirectionsService) {
        // TODO replace with Auth service with Principal
        $scope.isAuthenticated = () => true;
        $scope.map = getMap();
        $scope.selection = [];
        $scope.showRoute = showRoute;
        $scope.checkAllTrucks = true;
        $scope.toggleCollection = toggleCollection;
        $scope.collectionsAvailable = [/*'trucks', */'yellow', 'green', 'blue'];
        $scope.checkCollection = checkCollection;
        $scope.items = {
            trucks: [],
            blue: [],
            yellow: [],
            green: []
        };

        // Server Side Events
        configureSse();

        // load data
        loadContainers();
        loadTrucks();

        function configureSse() {
            var onTruckUpdated = function (event) {
                var updatedTruck = JSON.parse(event.data);
                $scope.$apply(function () {
                    var truck = $scope.items.trucks.find(t => t.registration === updatedTruck.registration);
                    if (truck) {
                        truck.coords.longitude = updatedTruck.location.longitude;
                        truck.coords.latitude = updatedTruck.location.latitude;
                    }
                });
            };

            // register
            SseService.register(onTruckUpdated);

            // unregister on exit
            $scope.$on("$destroy", function(){
                SseService.unregister(onTruckUpdated);
            });
        }

        function getMap() {
            return {
                control: {},
                center: {
                    latitude: 50.0613356,
                    longitude: 19.9379844
                },
                zoom: 14,
                options: {
                    scrollwheel: true,
                    panControl: false,
                    scaleControl: false,
                    draggable: true,
                    maxZoom: 22,
                    minZoom: 0
                },
                clusterOptions: {},
                clusterEvents: {},
                refresh: false,
                bounds: {},
                events: {
                    idle: function () {
                        console.log('idle');
                    }
                }
            }
        }

        function showRoute(registration) {
            loadRoute(registration, (route) => {
                DirectionsService.displayRoute($scope.map.control.getGMap(), route)
            });
        }

        function loadRoute(registration, callback) {
            Restangular.all('routes/' + registration).getList().then(function (resp) {
                var response = resp.plain();
                callback(response);
            })
        }

        function loadTrucks() {
            Restangular.all('trucks').getList().then(function (resp) {
                for (var i = 0; i < resp.length; i++) {
                    var truck = {
                        id: 0,
                        coords: {},
                        capacity: 0,
                        load: 0,
                        type: "truck",
                        options: {
                            draggable: false,
                            icon: 'assets/images/truck.png'
                        }
                    };
                    truck.id = resp[i].id;
                    truck.coords.latitude = resp[i].location.latitude;
                    truck.coords.longitude = resp[i].location.longitude;
                    truck.capacity = resp[i].capacity;
                    truck.load = resp[i].load + ' kg';
                    truck.registration = resp[i].registration;
                    $scope.items.trucks.push(truck);

                    if ($scope.checkAllTrucks) {
                        // select automatically
                        $scope.selection.push(truck);
                    }
                }

            })
        }

        function loadContainers() {
            Restangular.all('containers').getList().then(function (resp) {
                var num;
                var load_value;
                for (var i = 0; i < resp.length; i++) {
                    load_value = resp[i].sensors.load.value.toFixed(2);
                    if (load_value >= 0 && load_value < 5) {
                        num = 0;
                    } else if (load_value >= 5 && load_value < 15) {
                        num = 1;
                    } else if (load_value >= 15 && load_value < 25) {
                        num = 2;
                    } else if (load_value >= 25 && load_value < 35) {
                        num = 3;
                    } else if (load_value >= 35 && load_value < 45) {
                        num = 4;
                    } else if (load_value >= 45 && load_value < 55) {
                        num = 5;
                    } else if (load_value >= 55 && load_value < 65) {
                        num = 6;
                    } else if (load_value >= 65 && load_value < 75) {
                        num = 7;
                    } else if (load_value >= 75 && load_value < 85) {
                        num = 8;
                    } else if (load_value >= 85 && load_value < 95) {
                        num = 9;
                    } else {
                        num = 10;
                    }
                    var container = {
                        id: 0,
                        coords: {},
                        capacity: 0,
                        load: 0,
                        type: "",
                        options: {
                            draggable: false,
                            icon: {
                                url: 'assets/images/trash' + num + '_' + resp[i].type + '.png',
                                scaledSize: {width: 40, height: 40}
                            }
                        }
                    };
                    container.id = resp[i].id;
                    container.coords.latitude = resp[i].location.latitude;
                    container.coords.longitude = resp[i].location.longitude;
                    container.type = resp[i].type;
                    container.capacity = resp[i].capacity;
                    container.load = resp[i].sensors.load.value.toFixed(2) + '%';
                    $scope.items[resp[i].type].push(container);
                }

            })
        }

        function checkCollection(collectionName) {
            if ($scope.checkAllTrucks) {
                checkAll(collectionName);
            } else {
                uncheckAll(collectionName);
            }
        }

        function checkAll(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                var idx = $scope.selection.indexOf($scope.items[collectionName][i]);
                // is currently selected
                if (idx > -1) {
                    // TODO what's here?
                }
                // is newly selected
                else {
                    $scope.selection.push($scope.items[collectionName][i]);
                }
            }
        }

        function uncheckAll(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                var idx = $scope.selection.indexOf($scope.items[collectionName][i]);
                // is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
                // is newly selected
                else {
                    // TODO what's here?
                }
            }
        }

        function toggleSelection(item) {
            var idx = $scope.selection.indexOf(item);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(item);
            }
        }

        function toggleCollection(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                toggleSelection($scope.items[collectionName][i]);
            }
        }
    }
})();
