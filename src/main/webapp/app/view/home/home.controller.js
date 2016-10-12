(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Restangular', 'SseService', 'DirectionsService' ,'uiGmapIsReady'];

    function HomeController($scope, Restangular, SseService, DirectionsService, uiGmapIsReady) {
        // TODO replace with Auth service with Principal
        $scope.isAuthenticated = () => true;
        $scope.mapOptions = getMap();
        $scope.selection = [];
        $scope.showRoute = showRoute;
        $scope.checkAllElements = {'trucks':false, 'yellow':false, 'blue':false, 'green':false, 'broken':false};
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
        $scope.users = [];
        $scope.active = {'trucks': false, 'yellow': false, 'blue':false, 'green':false};
        $scope.showList = showList;
        $scope.fillingPercentageList = [];
        $scope.selectContainers = selectContainers;
        $scope.addContainer = addContainer;
        $scope.addTruck = addTruck;
        $scope.containerToAdd = {};
        $scope.containerToAdd.type = 'blue';
        $scope.truckToAdd = {};

        var marker;
        var mapCenter = new google.maps.LatLng($scope.mapOptions.center.latitude, $scope.mapOptions.center.longitude);

        $scope.mapProp = {
            center: mapCenter,
            zoom: 14,
            draggable: true,
            scrollwheel: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            events: {
                idle: function () {
                    console.log('idle');
                }
            }
        };


        $scope.containerMap = new google.maps.Map(document.getElementById("map-canvas-addcontainer"), $scope.mapProp);

        $scope.truckMap = new google.maps.Map(document.getElementById("map-canvas-addtruck"), $scope.mapProp);

        google.maps.event.addListener($scope.containerMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                $scope.containerMap, $scope.containerToAdd);
        });

        google.maps.event.addListener($scope.truckMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/truck.png', $scope.truckMap, $scope.truckToAdd);
        });



        $scope.$watch('containerToAdd.type', function(){
            if(marker != null){
                addMarker(marker.position, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                    $scope.containerMap, $scope.containerToAdd);
            }
        });

        $('#myAddTruckModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.truckMap);
        });

        $('#myAddTruckModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        $('#myAddContainerModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.containerMap);
        });

        $('#myAddContainerModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });




        // Server Side Events
        configureSse();

        // load data
        loadContainers();
        loadTrucks();
        loadUsers();
        setList();

        function addMarker(latLng, icon, map, item){
            //clear the previous marker and circle.
            if(marker != null){
                marker.setMap(null);
            }

            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: true,
                icon: icon
            });
            item.location = {};
            item.location.latitude = marker.position.lat();
            item.location.longitude = marker.position.lng();
        }

        function resizeMap(map) {
            if(typeof map == "undefined") return;
            setTimeout( function(){resizingMap(map);} , 400);
        }

        function resizingMap(map) {
            if(typeof map == "undefined") return;
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        }

        function addContainer(container){
            Restangular.all('containers').customPOST(container).then(function () {
                loadContainers();
                marker.setMap(null);
                $scope.containerToAdd = {};
                $scope.containerToAdd.type = 'blue';
            })
        }

        function addTruck(truck){
            Restangular.all('trucks').customPOST(truck).then(function () {
                loadTrucks();
                marker.setMap(null);
                $scope.truckToAdd = {};
            })
        }

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
                if(x > (parseInt(value)-10) && x <= parseInt(value)){
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
                DirectionsService.displayRoute($scope.mapOptions.control.getGMap(), route)
            });
        }

        function loadRoute(registration, callback) {
            Restangular.all('routes/' + registration).getList().then(function (resp) {
                var response = resp.plain();
                callback(response);
            })
        }

        function loadTrucks() {
            $scope.items.trucks = [];
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
            $scope.items.blue = [];
            $scope.items.yellow = [];
            $scope.items.green = [];
            $scope.items.broken = [];
            Restangular.all('containers').getList().then(function (resp) {
                var num;
                var load_value;
                for (var i = 0; i < resp.length; i++) {
                    num = parseInt((parseFloat(resp[i].sensors.load.value))/10);

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
                    container.load = parseFloat(resp[i].sensors.load.value).toFixed(2) + '%';
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

        function loadUsers() {
            Restangular.all('users').getList().then(function (data) {
                $scope.users = data;
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
