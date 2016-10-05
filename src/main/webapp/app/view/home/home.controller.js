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
        $scope.checkAllElements = {'trucks':true, 'yellow':false, 'blue':false, 'green':false, 'broken':false};
        $scope.toggleCollection = toggleCollection;
        $scope.collectionsAvailable = [/*'trucks', */'yellow', 'green', 'blue'];
        $scope.checkCollection = checkCollection;
        $scope.items = {
            trucks: [],
            blue: [],
            yellow: [],
            green: [],
            broken: []
        };
        $scope.active = {'trucks': false, 'yellow': false, 'blue':false, 'green':false};
        $scope.showList = showList;
        $scope.fillingPercentageList = [];
        $scope.selectContainers = selectContainers;

        $scope.drawingManagerOptions = {
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER
                ]
            },
            markerOptions: {
                icon: 'assets/images/truck.png'
            }
        };
        $scope.markersAndCircleFlag = true;
        $scope.drawingManagerControl = {};
        $scope.$watch('markersAndCircleFlag', function() {
            if (!$scope.drawingManagerControl.getDrawingManager) {
                return;
            }
            var controlOptions = angular.copy($scope.drawingManagerOptions);
            if (!$scope.markersAndCircleFlag) {
                controlOptions.drawingControlOptions.drawingModes.shift();
                controlOptions.drawingControlOptions.drawingModes.shift();
            }
            $scope.drawingManagerControl.getDrawingManager().setOptions(controlOptions);
        });




        // Server Side Events
        configureSse();

        // load data
        loadContainers();
        loadTrucks();
        setList();


        function isError(container){
            for(var sensor in container.sensors){
                if(container.sensors[sensor].errorCode != 0){
                    return true;
                }
            }
            return false;
        }


        function selectContainers(col, value){
            for(var i=0; i< $scope.items[col].length; i++){
                var x = parseFloat($scope.items[col][i].load.substr(0,$scope.items[col][i].load.length-1));
                if(x > (parseInt(value)-10) && x < parseInt(value)){
                    toggleSelection($scope.items[col][i]);
                }
            }
        }


        function setList() {
            for(var i = 100; i >= 10; i-=10){
                $scope.fillingPercentageList.push(i);
            }
        }

        function showList(item) {
            $scope.active[item] = !$scope.active[item];
        }


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
            SseService.register("truck", onTruckUpdated);

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

                    if ($scope.checkAllElements['trucks']) {
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
                    container.type = resp[i].type;
                    container.capacity = resp[i].capacity;
                    container.load = resp[i].sensors.load.value.toFixed(2) + '%';
                    container.sensors = resp[i].sensors;
                    $scope.items[resp[i].type].push(container);

                    if(isError(container)){
                        $scope.items['broken'].push(container);
                        container.options.icon.url = 'assets/images/trash_' + resp[i].type + '_error.png';
                    }


                    if (($scope.checkAllElements['yellow'] && container.type == 'yellow')
                        || ($scope.checkAllElements['green'] && container.type == 'green')
                    ||  ($scope.checkAllElements['blue'] && container.type == 'blue')){
                        // select automatically
                        $scope.selection.push(container);
                    }

                }

            })
        }

        function checkCollection(collectionName) {
            if ($scope.checkAllElements[collectionName]) {
                checkAll(collectionName);
            } else {
                uncheckAll(collectionName);
            }
        }

        function checkAll(collectionName) {
            for (var i = 0; i < $scope.items[collectionName].length; i++) {
                var idx = $scope.selection.indexOf($scope.items[collectionName][i]);
                // is newly selected
                if (idx <= -1) {
                    $scope.selection.push($scope.items[collectionName][i]);
                }
            }
            if(collectionName != 'trucks' && collectionName != 'broken'){
                for(var j=10; j<=100; j+=10){
                    var elem = document.getElementById(collectionName+'_'+j);
                    if(!elem.checked){
                        elem.checked = true;
                    }
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
            }
            if(collectionName != 'trucks' && collectionName != 'broken'){
                for(var j=10; j<=100; j+=10){
                    var elem = document.getElementById(collectionName+'_'+j);
                    if(elem.checked){
                        elem.checked = false;
                    }
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
