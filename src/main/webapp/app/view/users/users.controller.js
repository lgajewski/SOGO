(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$scope', '$filter', 'Restangular', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function UsersController($scope, $filter, Restangular, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.requests = [];
        $scope.users = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];




        $scope.acceptUser = function (item) {
            var user = {};
            user.activated = true;
            user.authorities = item.authorities;
            user.email = item.email;
            user.firstName = item.firstName;
            user.id = item.id;
            user.langKey = item.langKey;
            user.lastName = item.lastName;
            user.login = item.login;
            user.password = "";
            console.log(user);
            Restangular.one('users').put(user).then(function () {
                $scope.getUsers();
            });
        };

        $scope.disableUser = function (item) {
            var user = {};
            user.activated = false;
            user.authorities = item.authorities;
            user.email = item.email;
            user.firstName = item.firstName;
            user.id = item.id;
            user.langKey = item.langKey;
            user.lastName = item.lastName;
            user.login = item.login;
            user.password = "";

            console.log(user);
            Restangular.one('users').put(user).then(function () {
                $scope.getUsers();
            });
        };

        $scope.editUser = function (item) {
        };

        $scope.getUsers = function () {
            Restangular.all('users').getList().then(function (data) {
                $scope.items = data;
                $scope.requests = [];
                $scope.users = [];

                for(var i=0;i<$scope.items.length;i++){
                    if($scope.items[i].activated){
                        $scope.users.push($scope.items[i]);
                    } else {
                        $scope.requests.push($scope.items[i]);
                    }
                }
                // $scope.search();
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

        //
        // $scope.gap = 5;
        //
        // $scope.filteredItems = [];
        // $scope.filteredItems2 = [];
        // $scope.groupedItems = [];
        // $scope.itemsPerPage = 5;
        // $scope.pagedItems = [];
        // $scope.pagedItems2 = [];
        // $scope.currentPage = 0;
        // $scope.currentPage2 = 0;
        //
        //
        // // init the filtered items
        // $scope.search = function () {
        //     $scope.filteredItems = $scope.items.filter(function (item) {
        //         return !item.enabled;
        //     });
        //     $scope.currentPage = 0;
        //
        //     $scope.filteredItems2 = $scope.items.filter(function (item) {
        //         return item.enabled;
        //     });
        //     $scope.currentPage2 = 0;
        //     // now group by pages
        //     $scope.groupToPages();
        // };
        //
        //
        // // calculate page in place
        // $scope.groupToPages = function () {
        //     $scope.pagedItems = [];
        //
        //     for (var i = 0; i < $scope.filteredItems.length; i++) {
        //         if (i % $scope.itemsPerPage === 0) {
        //             $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
        //         } else {
        //             $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        //         }
        //     }
        //
        //
        //     $scope.pagedItems2 = [];
        //     for (var i = 0; i < $scope.filteredItems2.length; i++) {
        //         if (i % $scope.itemsPerPage === 0) {
        //             $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems2[i]];
        //         } else {
        //             $scope.pagedItems2[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems2[i]);
        //         }
        //     }
        // };
        //
        // $scope.range = function (size, start, end) {
        //     var ret = [];
        //     console.log(size, start, end);
        //
        //     if (size < end) {
        //         end = size;
        //         if (size < $scope.gap) {
        //             start = 0;
        //         } else {
        //             start = size - $scope.gap;
        //         }
        //
        //     }
        //     for (var i = start; i < end; i++) {
        //         ret.push(i);
        //     }
        //     console.log(ret);
        //     return ret;
        // };
        //
        // $scope.prevPage = function () {
        //     if ($scope.currentPage > 0) {
        //         $scope.currentPage--;
        //     }
        // };
        //
        // $scope.nextPage = function () {
        //     if ($scope.currentPage < $scope.pagedItems.length - 1) {
        //         $scope.currentPage++;
        //     }
        // };
        //
        // $scope.setPage = function () {
        //     $scope.currentPage = this.n;
        // };
        //
        // $scope.prevPage2 = function () {
        //     if ($scope.currentPage2 > 0) {
        //         $scope.currentPage2--;
        //     }
        // };
        //
        // $scope.nextPage2 = function () {
        //     if ($scope.currentPage2 < $scope.pagedItems2.length - 1) {
        //         $scope.currentPage2++;
        //     }
        // };
        //
        // $scope.setPage2 = function () {
        //     $scope.currentPage2 = this.n2;
        // };
        //

    }

})();
