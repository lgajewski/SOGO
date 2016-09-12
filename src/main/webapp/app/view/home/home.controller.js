(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Restangular', 'uiGmapIsReady', 'uiGmapGoogleMapApi', 'ActiveItemService', 'SseService'];

    function HomeController($scope, Restangular, uiGmapIsReady, uiGmapGoogleMapApi, ActiveItemService, SseService) {
        // register on SSE
        registerSseService();
        
        function registerSseService() {
            var onTruckUpdated = function(event) {
                var updatedTruck = JSON.parse(event.data);
                $scope.$apply(function () {
                    var truck = $scope.items['trucks'].find(t => t.registration === updatedTruck.registration);
                    if (truck) {
                        truck.coords.longitude = updatedTruck.location.longitude;
                        truck.coords.latitude = updatedTruck.location.latitude;
                    }
                });
            };

            SseService.register(onTruckUpdated);
        }
        
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

        $scope.collectionsAvailable = [/*'trucks', */'yellow', 'green', 'blue'];
        $scope.items = [];
        $scope.selection = [];
        // $scope.mapInit = {
        //     center: { latitude: 50.0613357, longitude: 19.9379844 },
        //     zoom: 14
        //
        // };
        $scope.showRoute = function (registration) {
            // if (registration) {
            $scope.loadRoute(registration, displayRoute);
            // }
        };

        $scope.loadRoute = function (registration, callback) {
            Restangular.all('routes/' + registration).getList().then(function (resp) {
                var response = resp.plain();
                callback(response);
            })
        };

        $scope.isTruck = function (marker) {
            // alert(marker.type === 'truck');
            if (marker.type === 'truck')
                return 1;
            return 0;
        };

        setTimeout(function () {
            // TODO change here, trucks addition
            $scope.$apply(function () {
                $scope.items['trucks'].forEach(function (truck) {
                    truck.coords.latitude += 0.01;
                    truck.coords.longitude += 0.01;
                });
            });
        }, 3000);

        $scope.loadTrucks = function () {
            Restangular.all('trucks').getList().then(function (resp) {
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
        // $scope.loadContainers = function () {
        //     Restangular.all('containers').getList().then(function (resp) {
        //         console.log(resp);
        //         $scope.items["blue"] = [];
        //         $scope.items["yellow"] = [];
        //         $scope.items["green"] = [];
        //         for (var i = 0; i < resp.length; i++) {
        //             var container = {
        //                 id: 0,
        //                 coords: {},
        //                 capacity: 0,
        //                 load: 0,
        //                 type: "",
        //                 options: {
        //                     draggable: false,
        //                     icon: 'assets/images/ic_map_trash_' + resp[i].type + '.png'
        //                 }
        //             };
        //             container.id = resp[i].id;
        //             container.coords.latitude = resp[i].location.latitude;
        //             container.coords.longitude = resp[i].location.longitude;
        //             container.type = resp[i].type;
        //             container.capacity = resp[i].capacity;
        //             container.load = resp[i].sensors.load.value.toFixed(2) + '%';
        //             $scope.items[resp[i].type].push(container);
        //         }
        //
        //     })
        // };
        $scope.loadContainers = function () {
            Restangular.all('containers').getList().then(function (resp) {
                var num;
                var load_value;
                $scope.items["blue"] = [];
                $scope.items["yellow"] = [];
                $scope.items["green"] = [];
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
                                url: 'assets/images/trash' + num + '_transparent.png',
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
        };
        $scope.loadData = function () {
            // $scope.loadMap();
            $scope.loadContainers();
            $scope.loadTrucks();
        };
        $scope.loadData();
        $scope.checkAllTrucks = false;

        $scope.checkCollection = function checkCollection(collectionName) {
            if ($scope.checkAllTrucks) {
                $scope.checkAll(collectionName);
            } else {
                $scope.uncheckAll(collectionName);
            }
        };

        $scope.checkAll = function checkAll(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                var idx = $scope.selection.indexOf($scope.items[collectionName][i]);
                // is currently selected
                if (idx > -1) {
                }

                // is newly selected
                else {
                    $scope.selection.push($scope.items[collectionName][i]);
                }
            }
        };
        $scope.uncheckAll = function uncheckAll(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                var idx = $scope.selection.indexOf($scope.items[collectionName][i]);
                // is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
                // is newly selected
                else {
                }
            }
        };

        $scope.toggleSelection = function toggleSelection(item) {
            var idx = $scope.selection.indexOf(item);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(item);
            }
        };

        $scope.toggleCollection = function toggleCollection(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                $scope.toggleSelection($scope.items[collectionName][i]);
            }
        };


        // $scope.origin = {location: {lat:50.0613358, lng: 19.9379845}};
        // $scope.destination = {location: {lat:50.0613356, lng: 19.9379842}};
        // $scope.wayPoints = [
        //     {location: {lat:50.0613367, lng: 19.9379841}, stopover: true},
        //     {location: {lat:50.0613359, lng: 19.9379849}, stopover: true}
        // ];

        function displayRoute(route) {

            //====================
            var batches = [];
            var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
            var itemsCounter = 0;
            var wayptsExist = route.length > 0;
            var directionsService = new $scope.maps.DirectionsService();
            if (route.length == 0) {
                $scope.directionsDisplay.setMap(null);
                return;
            }
            $scope.directionsDisplay.setMap($scope.map.control.getGMap());
            while (wayptsExist) {
                var subBatch = [];
                var subitemsCounter = 0;

                for (var j = itemsCounter; j < route.length; j++) {
                    subitemsCounter++;
                    subBatch.push({
                        location: new window.google.maps.LatLng(route[j].latitude, route[j].longitude),
                        stopover: true
                    });
                    if (subitemsCounter == itemsPerBatch)
                        break;
                }

                itemsCounter += subitemsCounter;
                batches.push(subBatch);
                wayptsExist = itemsCounter < route.length;
                // If it runs again there are still points. Minus 1 before continuing to
                // start up with end of previous tour leg
                itemsCounter--;
            }

            // now we should have a 2 dimensional array with a list of a list of waypoints
            var combinedResults;
            var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
            var directionsResultsReturned = 0;

            for (var k = 0; k < batches.length; k++) {
                var lastIndex = batches[k].length - 1;
                var start = batches[k][0].location;
                var end = batches[k][lastIndex].location;

                // trim first and last entry from array
                var waypts = [];
                waypts = batches[k];
                waypts.splice(0, 1);
                waypts.splice(waypts.length - 1, 1);

                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    travelMode: window.google.maps.TravelMode.DRIVING
                };

                // directionsService.route(request, function (response, status) {
                //     console.log('directions found');
                //     if (status === google.maps.DirectionsStatus.OK) {
                //         $scope.directionsDisplay.setDirections(response);
                //     } else {
                //         console.log('Directions request failed due to ' + status);
                //     }
                // });

                directionsService.route(request, function (result, status) {
                    if (status == window.google.maps.DirectionsStatus.OK) {

                        var unsortedResult = {order: k, result: result};
                        unsortedResults.push(unsortedResult);

                        directionsResultsReturned++;

                        if (directionsResultsReturned == batches.length) // we've received all the results. put to map
                        {
                            var count = 0;
                            for (var key in unsortedResults) {
                                if (unsortedResults[key].result != null) {
                                    if (unsortedResults.hasOwnProperty(key)) {
                                        if (count == 0) // first results. new up the combinedResults object
                                            combinedResults = unsortedResults[key].result;
                                        else {
                                            // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
                                            // directionResults object, but enough to draw a path on the map, which is all I need
                                            combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
                                            combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

                                            combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                            combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
                                        }
                                        count++;
                                    }
                                }
                            }
                            $scope.directionsDisplay.setDirections(combinedResults);
                        }
                    }
                });

            }

            // console.log(route);
            // var origin = route[0];
            // var destination = route[route.length-1];
            // var waypts = [];
            // console.log(origin);
            // console.log(destination);
            //
            // for(var i = 1; i<route.length-1;i++){
            //     waypts.push({
            //         location: route[i].latitude + ", " + route[i].longitude,
            //         stopover: false
            //     });
            // }
            // console.log(waypts);
            // directions($scope.maps, origin.latitude + ", " + origin.longitude, destination.latitude + ", " + destination.longitude, waypts);


        };

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
