(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/home/home.html',
                    controller: 'HomeController',
                    resolve: {
                        savePropsToVariable: ['$http', function ($http) {
                            return $http
                                .get('resources/errorcodes.json')
                                .then(function (response) {
                                    return response.data;
                            });
                        }],
                        containers: function($q, Restangular){
                            var deferred = $q.defer();
                            var items = {};
                            items.blue = [];
                            items.yellow = [];
                            items.green = [];
                            items.broken = [];
                            Restangular.all('containers').getList().then(function (resp) {
                                var num;
                                for (var i = 0; i < resp.length; i++) {
                                    num = parseInt((parseFloat(resp[i].sensors.load.value))/10);

                                    var container = {
                                        id: 0,
                                        coords: {},
                                        address: "",
                                        capacity: 0,
                                        load: 0,
                                        type: "",
                                        sensors: {},
                                        options: {
                                            draggable: false,
                                            icon: {
                                                url: 'assets/images/trash' + num + '_' + resp[i].type + '.png',
                                                scaledSize: {width: 30, height: 30}
                                            }
                                        }
                                    };
                                    container.id = resp[i].id;
                                    container.coords.latitude = resp[i].location.latitude;
                                    container.coords.longitude = resp[i].location.longitude;
                                    container.address = resp[i].address;
                                    container.type = resp[i].type;
                                    container.capacity = resp[i].capacity;
                                    container.load = parseFloat(resp[i].sensors.load.value).toFixed(2);
                                    container.sensors = resp[i].sensors;
                                    items[resp[i].type].push(container);

                                    if(isError(container)){
                                        items['broken'].push(container);
                                        container.options.icon.url = 'assets/images/trash_' + resp[i].type + '_error.png';
                                    }
                                }
                                deferred.resolve(items);
                            });
                            return deferred.promise;
                        },
                        trucks: function ($q, Restangular){
                            var deferred = $q.defer();
                            var trucks = [];
                            Restangular.all('trucks').getList().then(function (resp) {
                                for (var i = 0; i < resp.length; i++) {
                                    var truck = {
                                        id: 0,
                                        coords: {},
                                        address: "",
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
                                    truck.load = resp[i].load;
                                    truck.registration = resp[i].registration;
                                    truck.address = resp[i].address;

                                    trucks.push(truck);
                                }
                                deferred.resolve(trucks);
                            });
                            return deferred.promise;
                        },
                        fillingPercentageList: function () {
                            var fillingPercentageList = [];
                            for(var i = 100; i >= 10; i-=10){
                                fillingPercentageList.push(i);
                            }
                            return fillingPercentageList;
                        }



                    }
                })
        })

    function isError(container){
        for(var sensor in container.sensors){
            if(container.sensors[sensor].errorCode != 0){
                return true;
            }
        }
        return false;
    }
})();
