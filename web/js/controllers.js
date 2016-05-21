'use strict';

/* Controllers */

angular.module('sogo.controllers', [])

    .controller('GreetingController',function($scope,$state, GreetingService) {

        $scope.greeting = GreetingService.query();
        console.log((GreetingService.query()));

    })
    .controller('ContainerController',function($scope, $filter, ContainerService) {

        $scope.items = ContainerService.query(function() {
            
        $scope.showDetail = function (item) {
            if ($scope.active != item.id) {
                $scope.active = item.id;
            }
            else {
                $scope.active = null;
            }
        };


        console.log($scope.items);

        $scope.gap = 5;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.currentPage = 0;

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                for(var attr in item) {
                    if (searchMatch(item[attr], $scope.query))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };


        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
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
        $scope.search();
        });
    })

    .controller('TruckController',function($scope, $filter, TruckService) {

        $scope.items = TruckService.query(function() {

            $scope.showDetail = function (item) {
                if ($scope.active != item.registration) {
                    $scope.active = item.registration;
                }
                else {
                    $scope.active = null;
                }
            };


            console.log($scope.items);

            $scope.gap = 5;

            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;

            var searchMatch = function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
            };

            // init the filtered items
            $scope.search = function () {
                $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                    for(var attr in item) {
                        if (searchMatch(item[attr], $scope.query))
                            return true;
                    }
                    return false;
                });
                $scope.currentPage = 0;
                // now group by pages
                $scope.groupToPages();
            };


            // calculate page in place
            $scope.groupToPages = function () {
                $scope.pagedItems = [];

                for (var i = 0; i < $scope.filteredItems.length; i++) {
                    if (i % $scope.itemsPerPage === 0) {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                    } else {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
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
            $scope.search();
        });
    })

    .controller('UserController',function($scope, $filter, UserService) {

        $scope.items = UserService.query(function() {

            $scope.showDetail = function (item) {
                if ($scope.active != item.id) {
                    $scope.active = item.id;
                }
                else {
                    $scope.active = null;
                }
            };


            console.log($scope.items);

            $scope.gap = 5;

            $scope.filteredItems = [];
            $scope.filteredItems2 = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.pagedItems2 = [];
            $scope.currentPage = 0;
            $scope.currentPage2 = 0;

            var searchMatch = function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
            };

            // init the filtered items
            $scope.search = function () {
                $scope.filteredItems = $scope.items.filter(function(item){
                    return item.enabled;
                });


                $scope.currentPage = 0;

                $scope.filteredItems2 = $scope.items.filter(function(item){
                    return !item.enabled;
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
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                    } else {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                    }
                }

                for (var i = 0; i < $scope.filteredItems2.length; i++) {
                    if (i % $scope.itemsPerPage === 0) {
                        $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems2[i] ];
                    } else {
                        $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems2[i]);
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
            $scope.search();
        });
    });