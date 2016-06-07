'use strict';

/* Controllers */

angular.module('sogo.controllers', [])

    .controller('GreetingController',function($scope,$state, GreetingService) {

        $scope.greeting = GreetingService.query();
        console.log((GreetingService.query()));

    })
    .controller('HomeController',function($scope,$state, Restangular, uiGmapGoogleMapApi) {
        uiGmapGoogleMapApi.then(function(maps) {

        });
        $scope.collectionsAvailable = ['trucks', 'yellow', 'green', 'blue'];
        $scope.items = [];
        $scope.selection = [];
        $scope.map = {
            center: { latitude: 50.0613357, longitude: 19.9379844 },
            zoom: 14

        };
        $scope.loadTrucks = function(){
            Restangular.all('trucks').getList().then(function (resp) {
                console.log(resp);
                $scope.items['trucks'] = [];
                for (var i =0; i < resp.length; i++) {
                    var truck = {
                        id: 0,
                        coords: {},
                        options: {
                            draggable: false,
                            icon: 'assets/truck.png'
                        }
                    };
                    truck.id = resp[i].id;
                    truck.coords.latitude = resp[i].location.latitude;
                    truck.coords.longitude = resp[i].location.longitude;
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
                        options: {
                            draggable: false,
                            icon: 'assets/ic_map_trash_' + resp[i].type + '.png'
                        }
                    };
                    container.id = resp[i].id;
                    container.coords.latitude = resp[i].location.latitude;
                    container.coords.longitude = resp[i].location.longitude;
                    $scope.items[resp[i].type].push(container);
                }

            })
        };
        $scope.loadData = function() {
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
            }
        };

    })
    .controller('ContainerController',function($scope, $filter, Restangular) {
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

    .controller('TruckController',function($scope, $filter, Restangular) {

        $scope.getTrucks = function(){
            Restangular.all('trucks').getList().then(function(data) {
                $scope.items = data;
                $scope.search();
            })
        };
        $scope.getTrucks();

        $scope.deleteTruck = function (truck) {
            Restangular.all('trucks').one(truck.registration).remove().then(function () {
                $scope.getTrucks();
            })
        };

        $scope.showDetail = function (item) {
            if ($scope.active != item.registration) {
                $scope.active = item.registration;
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

        // functions have been describe process the data for display

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