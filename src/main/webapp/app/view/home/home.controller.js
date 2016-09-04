(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'Restangular', 'uiGmapIsReady', 'uiGmapGoogleMapApi', 'ActiveItemService', '$timeout'];

    function HomeController($scope, $state, Restangular, uiGmapIsReady, uiGmapGoogleMapApi, ActiveItemService, $timeout) {
        // TODO replace with Auth service with Principal
        $scope.isAuthenticated = function () {
            return true
        };

        $scope.route = [];
        $scope.maps = {};
        $scope.map = {
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
        };
        uiGmapGoogleMapApi.then(function (maps) {
            $scope.directionsDisplay = new maps.DirectionsRenderer();
            uiGmapIsReady.promise().then(function (instances) {
                $scope.maps = maps;
                // directions(maps, '50.0613358', '19.9379845');
                // $timeout(function() {
                //     directions(maps, '50.0614336', '19.9379844');
                // }, 1000)
            });
        });

        $scope.activeObject = ActiveItemService.getObject();

        $scope.collectionsAvailable = ['trucks', 'yellow', 'green', 'blue'];
        $scope.items = [];
        $scope.selection = [];
        // $scope.mapInit = {
        //     center: { latitude: 50.0613357, longitude: 19.9379844 },
        //     zoom: 14
        //
        // };
        $scope.showRoute = function (registration) {
            if (registration) {
                $scope.loadRoute(registration, displayRoute);
            }
        }
        $scope.loadRoute = function (registration, callback) {
            Restangular.all('routes/' + registration).getList().then(function (resp) {
                console.log(resp);
                var response = resp.plain();
                callback(response);
            })
        };

        $scope.isTruck = function (marker) {
            // alert(marker.type === 'truck');
            if (marker.type === 'truck')
                return 1;
            return 0;
        }

        $scope.loadTrucks = function () {
            Restangular.all('trucks').getList().then(function (resp) {
                console.log(resp);
                $scope.items['trucks'] = [];
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
                    $scope.items['trucks'].push(truck);
                }

            })
        };
        $scope.loadContainers = function () {
            Restangular.all('containers').getList().then(function (resp) {
                console.log(resp);
                $scope.items["blue"] = [];
                $scope.items["yellow"] = [];
                $scope.items["green"] = [];
                for (var i = 0; i < resp.length; i++) {
                    var container = {
                        id: 0,
                        coords: {},
                        capacity: 0,
                        load: 0,
                        type: "",
                        options: {
                            draggable: false,
                            icon: 'assets/images/ic_map_trash_' + resp[i].type + '.png'
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
        };
        $scope.loadData = function () {
            // $scope.loadMap();
            $scope.loadContainers();
            $scope.loadTrucks();
        };
        $scope.loadData();
        $scope.toggleSelection = function toggleSelection(collectionName) {
            var idx = $scope.selection.indexOf(collectionName);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(collectionName);
                // $scope.loadRoute('KRA 6479', displayRoute);
            }
        };


        // $scope.origin = {location: {lat:50.0613358, lng: 19.9379845}};
        // $scope.destination = {location: {lat:50.0613356, lng: 19.9379842}};
        // $scope.wayPoints = [
        //     {location: {lat:50.0613367, lng: 19.9379841}, stopover: true},
        //     {location: {lat:50.0613359, lng: 19.9379849}, stopover: true}
        // ];

        function displayRoute(route) {
            console.log(route);
            var origin = route[0];
            var destination = route[route.length - 1];
            var waypts = [];
            console.log(origin);
            console.log(destination);

            for (var i = 1; i < route.length - 1; i++) {
                waypts.push({
                    location: route[i].latitude + ", " + route[i].longitude,
                    stopover: false
                });
            }
            console.log(waypts);
            directions($scope.maps, origin.latitude + ", " + origin.longitude, destination.latitude + ", " + destination.longitude, waypts);


        }

        function directions(maps, origin, destination, waypts) {
            console.log('getting directions');
            var directionsService = new maps.DirectionsService();
            $scope.directionsDisplay.setMap($scope.map.control.getGMap());
            // console.log(waypts);
            var request = {
                origin: origin,
                destination: destination,
                travelMode: maps.TravelMode['DRIVING'],
                waypoints: waypts,
                optimizeWaypoints: true
            };

            directionsService.route(request, function (response, status) {
                console.log('directions found');
                if (status === google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(response);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });

        }

    }


})();
