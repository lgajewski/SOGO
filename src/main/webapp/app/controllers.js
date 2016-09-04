'use strict';

/* Controllers */

angular.module('sogo.controllers', [])

    .controller('GreetingController',function($scope,$state, GreetingService) {

        $scope.greeting = GreetingService.query();
        console.log((GreetingService.query()));

    })
    .controller('HomeController',function($scope, $state, Restangular, uiGmapIsReady, uiGmapGoogleMapApi, ActiveItemService, $timeout) {
        // TODO replace with Auth service with Principal
        $scope.isAuthenticated = function() { return true };

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
            refresh : false,
            bounds: {},
            events: {
                idle: function() {
                    console.log('idle');
                }
            }
        };
        uiGmapGoogleMapApi.then(function(maps) {
                $scope.directionsDisplay = new maps.DirectionsRenderer();
                uiGmapIsReady.promise().then(function(instances) {
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
        $scope.showRoute = function(registration){
            if(registration){
                $scope.loadRoute(registration, displayRoute);
            }
        }
        $scope.loadRoute = function(registration, callback){
            Restangular.all('routes/'+registration).getList().then(function (resp) {
                console.log(resp);
                var response = resp.plain();
                callback(response);
            })
        };

        $scope.isTruck = function(marker){
            // alert(marker.type === 'truck');
            if(marker.type === 'truck')
                return 1;
            return 0;
        }

        $scope.loadTrucks = function(){
            Restangular.all('trucks').getList().then(function (resp) {
                console.log(resp);
                $scope.items['trucks'] = [];
                for (var i =0; i < resp.length; i++) {
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
        $scope.loadContainers = function(){
            Restangular.all('containers').getList().then(function (resp) {
                console.log(resp);
                $scope.items["blue"] = [];
                $scope.items["yellow"] = [];
                $scope.items["green"] = [];
                for (var i =0; i < resp.length; i++) {
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
        $scope.loadData = function() {
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

        function displayRoute(route){
            console.log(route);
            var origin = route[0];
            var destination = route[route.length-1];
            var waypts = [];
            console.log(origin);
            console.log(destination);

            for(var i = 1; i<route.length-1;i++){
                waypts.push({
                    location: route[i].latitude + ", " + route[i].longitude,
                    stopover: false
                });
            }
            console.log(waypts);
            directions($scope.maps, origin.latitude + ", " + origin.longitude, destination.latitude + ", " + destination.longitude, waypts);


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

    })
    .controller('ContainerController',function($scope, $filter, Restangular, ActiveItemService) {

        $scope.activeObject = ActiveItemService.getObject();
        $scope.setActiveObject = function(item) {
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

        $scope.getContainers = function() {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
                $scope.search();
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

        $scope.gap = 5;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        // init the filtered items
        $scope.search = function () {

            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };

        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            for (var i = 0; i < $scope.items.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.items[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.items[i]);
                }
            }
        };

        $scope.range = function (size,start, end) {
            var ret = [];
            console.log(size,start, end);

            if (size < end) {
                end = size;
                if(size<$scope.gap){
                    start = 0;
                }else{
                    start = size-$scope.gap;
                }

            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            console.log(ret);
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };


    })

    .controller('UserController',function($scope, $filter, Restangular) {

        $scope.acceptUser = function (item) {
            Restangular.all('users').one(item.username).one('enable').post().then(function () {
                $scope.getUsers();
            });
        };

        $scope.disableUser = function (item) {
            Restangular.all('users').one(item.username).one('disable').post().then(function () {
                $scope.getUsers();
            });
        };

        $scope.editUser = function (item) {
        };

        $scope.getUsers = function() {
            Restangular.all('users').getList().then(function (data) {
                $scope.items = data;
                $scope.search();
            })
        };
        $scope.getUsers();

        $scope.showDetail = function (item) {
            if ($scope.active != item.id) {
                $scope.active = item.id;
            }
            else {
                $scope.active = null;
            }
        };


        $scope.gap = 5;

        $scope.filteredItems = [];
        $scope.filteredItems2 = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.pagedItems2 = [];
        $scope.currentPage = 0;
        $scope.currentPage2 = 0;


        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $scope.items.filter(function (item) {
                return !item.enabled;
            });
            $scope.currentPage = 0;

            $scope.filteredItems2 = $scope.items.filter(function (item) {
                return item.enabled;
            });
            $scope.currentPage2 = 0;
            // now group by pages
            $scope.groupToPages();
        };


        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }


            $scope.pagedItems2 = [];
            for (var i = 0; i < $scope.filteredItems2.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems2[i]];
                } else {
                    $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems2[i]);
                }
            }
        };

        $scope.range = function (size, start, end) {
            var ret = [];
            console.log(size, start, end);

            if (size < end) {
                end = size;
                if (size < $scope.gap) {
                    start = 0;
                } else {
                    start = size - $scope.gap;
                }

            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            console.log(ret);
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

        $scope.prevPage2 = function () {
            if ($scope.currentPage2 > 0) {
                $scope.currentPage2--;
            }
        };

        $scope.nextPage2 = function () {
            if ($scope.currentPage2 < $scope.pagedItems2.length - 1) {
                $scope.currentPage2++;
            }
        };

        $scope.setPage2 = function () {
            $scope.currentPage2 = this.n2;
        };


    });
