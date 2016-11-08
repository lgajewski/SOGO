(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Restangular', 'SseService', 'DirectionsService', '$http', '$filter'];

    function HomeController($scope, Restangular, SseService, DirectionsService, $http, $filter) {
        // TODO replace with Auth service with Principal
        $scope.isAuthenticated = () => true;
        $scope.mapOptions = getMap();
        $scope.selection = [];
        $scope.showRoute = showRoute;
        $scope.errorCodes = errorCodes;
        $scope.savePropsToVariable = savePropsToVariable;
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
        $scope.alerts = [];
        $scope.users = [];
        $scope.active = {'trucks': false, 'yellow': false, 'blue':false, 'green':false};
        $scope.showList = showList;
        $scope.fillingPercentageList = [];
        $scope.selectContainers = selectContainers;
        $scope.addContainer = addContainer;
        $scope.addTruck = addTruck;
        $scope.containerToAdd = {};
        $scope.containerToAdd.type = 'blue';
        $scope.containerToAdd.sensors = {
            load: {
                value: 0.0
            }
        };
        $scope.truckToAdd = {};
        $scope.truckToAdd.load = 0;

        var marker;
        var mapCenter = new google.maps.LatLng($scope.mapOptions.center.latitude, $scope.mapOptions.center.longitude);
        var prop;

        savePropsToVariable();

        $scope.mapProp = {
            center: mapCenter,
            zoom: 14,
            draggable: true,
            scrollwheel: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            events: {
                idle: function () {}
            }
        };
        var geocoder = new google.maps.Geocoder();

        $scope.displayInfoWindow = function displayInfoWindow(selectedMarker, event, selectedItem){
            // var latlng = new google.maps.LatLng(selectedItem.coords.latitude, selectedItem.coords.longitude);
            // var address = "";
            // geocoder.geocode({'latLng':latlng}, function(results, status){
            //     address=results[0].formatted_address;
            //
            // });

            var infoWindow = new google.maps.InfoWindow({
                content: "<table style='width:100%'>" +
                "<tbody>" +
                "<tr>" +
                "<td>Id:</td>" +
                "<td>" + selectedItem.id + "</td>" +
                "</tr>" +
                (selectedItem.registration ?
                "<tr>" +
                "<td>" + $filter('translate')('REGISTRATION') + ":</td>" +
                "<td>" + selectedItem.registration + "</td>" +
                "</tr>" : "") +
                "<tr>" +
                "<td>" + $filter('translate')('TYPE') + ":</td>" +
                "<td>" + selectedItem.type + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + $filter('translate')('ADDRESS') + ":</td>" +
                "<td>" + selectedItem.address + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + $filter('translate')('CAPACITY') + ":</td>" +
                "<td>" + selectedItem.capacity + "kg</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" + $filter('translate')('LOAD') + ":</td>" +
                "<td>" + selectedItem.load + (selectedItem.type == 'truck' ? 'kg':'%') + "</td>" +
                "</tr>" +
                "</tbody>" +
                "</table>"
            });
            infoWindow.open(selectedMarker.getMap(), selectedMarker);
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
                $scope.containerToAdd.sensors = {
                    load: {
                        value: 0.0
                    }
                };
            })
        }

        function addTruck(truck){
            Restangular.all('trucks').customPOST(truck).then(function () {
                loadTrucks();
                marker.setMap(null);
                $scope.truckToAdd = {};
                $scope.truckToAdd.load = 0;
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
                        truck.address = updatedTruck.address;
                        truck.load = updatedTruck.load;
                    }
                });
            };

            var onContainerUpdated = function (event) {
                var updatedContainer = JSON.parse(event.data);
                var load_value = parseFloat(updatedContainer.sensors.load.value).toFixed(2);
                var num = parseInt(load_value/10);

                $scope.$apply(function () {
                    // var updatedContainer = JSON.parse(event.data);
                    var container = $scope.items[updatedContainer.type].find(c => c.id === updatedContainer.id);
                    if (container) {
                        container.capacity = updatedContainer.capacity;
                        container.coords.longitude = updatedContainer.location.longitude;
                        container.coords.latitude = updatedContainer.location.latitude;
                        container.address = updatedContainer.address;
                        container.type = updatedContainer.type;
                        container.load = parseFloat(updatedContainer.sensors.load.value).toFixed(2);
                        container.sensors = updatedContainer.sensors;
                        container.options.icon.url = 'assets/images/trash' + num + '_' + updatedContainer.type + '.png';

                        if(isError(container)){
                            if(!$scope.items['broken'].find(c => c.id === updatedContainer.id)){
                                $scope.items['broken'].push(container);
                            }
                            container.options.icon.url = 'assets/images/trash_' + updatedContainer.type + '_error.png';
                        }
                    }
                });
            }

            // register
            SseService.register("truck", onTruckUpdated);
            SseService.register("container", onContainerUpdated);

            // unregister on exit
            $scope.$on("$destroy", function(){
                SseService.unregister(onTruckUpdated);
                SseService.unregister(onContainerUpdated);
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
                    minZoom: 0,
                    cluster: {
                        minimumClusterSize : 5,
                        zoomOnClick: true,
                        // styles: [{
                        //     url: "assets/images/ic_map_trash_blue.png",
                        //     width:60,
                        //     height:60,
                        //     textColor: 'black',
                        //     textSize: 14,
                        //     fontFamily: 'Open Sans'
                        // }],
                        averageCenter: true,
                        clusterClass: 'cluster-icon'
                    }
                },
                clusterOptions: {},
                clusterEvents: {},
                refresh: false,
                bounds: {},
                events: {
                    idle: function () {}
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

        function savePropsToVariable() {
            $http.get('resources/errorcodes.properties').then(function (response) {
                prop = response.data;
            })
        }

        function errorCodes(container) {
            for(var sensor in container.sensors){
                var ec = container.sensors[sensor].errorCode;

                if(ec != 0){

                    var alert = {
                        containerId: 0,
                        containerAddress: "",
                        sensor: "",
                        errorCode: 0,
                        errorMessage: ""
                    }

                    alert.containerId = container.id;
                    alert.containerAddress = container.address;
                    alert.sensor = sensor;
                    alert.errorCode = ec;
                    alert.errorMessage = prop[ec];
                    $scope.alerts.push(alert);
                }
            }
        }
    }
})();
