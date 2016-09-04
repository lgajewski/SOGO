(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$scope', '$filter', 'Restangular', 'ActiveItemService'];

    function TrucksController($scope, $filter, Restangular, ActiveItemService) {

        $scope.activeObject = ActiveItemService.getObject();
        $scope.setActiveObject = function(item) {
            $scope.activeObject.id = item.id;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.options.icon = 'assets/images/truck.png';
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude

        };
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

    }

})();
