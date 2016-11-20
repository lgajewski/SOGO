(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$scope', 'trucks', 'users', 'Restangular', 'ActiveItemService',
        'DTOptionsBuilder', 'DTColumnDefBuilder', '$filter', 'Notification'];

    function TrucksController($scope, trucks, users, Restangular, ActiveItemService,
                              DTOptionsBuilder, DTColumnDefBuilder, $filter, Notification) {
        $scope.items = trucks;
        $scope.getTrucks = getTrucks;
        $scope.deleteTruck = deleteTruck;
        $scope.addTruck = addTruck;
        $scope.showDetail = showDetail;
        $scope.setActiveObject = setActiveObject;
        $scope.setTruckToEdit = setTruckToEdit;
        $scope.editTruck = editTruck;
        $scope.users = users;


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

        $scope.activeObject = ActiveItemService.getObject();
        $scope.truckToAdd = {};
        $scope.truckToAdd.load = 0;
        $scope.truckToEdit = {};
        var mapCenter = new google.maps.LatLng(50.0613356, 19.9379844);

        $scope.defaultMapProperties = {
            center: mapCenter,
            zoom: 14,
            draggable: true,
            scrollwheel: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            events: {
                idle: function () {}
            }
        };

        $scope.truckAddMap = new google.maps.Map(document.getElementById("map-canvas-addtruck"), $scope.defaultMapProperties);
        $scope.truckEditMap = new google.maps.Map(document.getElementById("map-canvas-edittruck"), $scope.defaultMapProperties);
        $scope.truckShowMap = new google.maps.Map(document.getElementById("map-canvas-showtruck"), $scope.defaultMapProperties);

        var marker;



        google.maps.event.addListener($scope.truckAddMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/truck.png',
                $scope.truckAddMap, $scope.truckToAdd);
        });

        google.maps.event.addListener($scope.truckEditMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/truck.png',
                $scope.truckEditMap, $scope.truckToEdit);
        });


        $('#myAddModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.truckAddMap);
        });

        $('#myAddModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        $('#myEditModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.truckEditMap);
            var pos = new google.maps.LatLng($scope.truckToEdit.location.latitude, $scope.truckToEdit.location.longitude);
            addMarker(pos, 'assets/images/truck.png',
                $scope.truckEditMap, $scope.truckToEdit);
            $scope.truckEditMap.center = new google.maps.LatLng($scope.truckToEdit.location.latitude, $scope.truckToEdit.location.longitude);

        });

        $('#myEditModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        $('#myShowLocationModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.truckShowMap);
            var pos = new google.maps.LatLng($scope.truckToEdit.location.latitude, $scope.truckToEdit.location.longitude);
            addMarker(pos, 'assets/images/truck.png',
                $scope.truckShowMap, $scope.truckToEdit);
            $scope.truckShowMap.center = new google.maps.LatLng($scope.truckToEdit.location.latitude, $scope.truckToEdit.location.longitude);

        });

        $('#myShowLocationModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        function addMarker(latLng, icon, map, item){
            //clear the previous marker and circle.
            if(marker != null){
                marker.setMap(null);
            }

            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: false,
                icon: {
                    url: icon,
                    scaledSize: {width: 30, height: 30}
                }
            });

            if(item.id) {
                var contentString = '<table style="width:100%">'
                    + '<tbody>'
                    // + '<tr>'
                    // + '<td>Id:</td>'
                    // + '<td>' + item.id + '</td>'
                    // + '</tr>'
                    + '<tr>'
                    + '<td>' + $filter('translate')('REGISTRATION') + ':</td>'
                    + '<td>' + item.registration + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>' + $filter('translate')('ADDRESS') + ':</td>'
                    + '<td>' + item.address + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>' + $filter('translate')('CAPACITY') + ':</td>'
                    + '<td>' + item.capacity + 'kg</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>' + $filter('translate')('LOAD') + ':</td>'
                    + '<td>' + item.load + 'kg</td>'
                    + '</tr>'
                    + '</tbody>'
                    + '</table>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
            }
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

        function getTrucks() {
            Restangular.all('trucks').getList().then(function (data) {
                $scope.items = data;
            })
        }
        function setActiveObject(item) {
            $scope.activeObject.id = item.id;
            $scope.activeObject.coords = item.location;
            $scope.activeObject.options.icon = 'assets/images/truck.png';
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude
        }

        function addTruck(truck){
            Restangular.all('trucks').customPOST(truck).then(function () {
                Notification.success('Truck added');
                $scope.getTrucks();
                if(marker != null){
                    marker.setMap(null);
                }
                $scope.truckToAdd = {};
                $scope.truckToAdd.load = 0;
            })
        }

        function editTruck(truck){
            Restangular.all('trucks').customPUT(truck).then(function () {
                $scope.getTrucks();
                Notification.success('Truck ' + truck.registration +  ' edited');
            })
        }

        function deleteTruck(truck) {
            Restangular.all('trucks').one(truck.registration).remove().then(function () {
                $scope.getTrucks();
                Notification.success('Truck ' + truck.registration +  ' deleted');
            })
        }

        function setTruckToEdit(truck){
            $scope.truckToEdit = _.clone(truck);

        }

        function showDetail(item) {
            if ($scope.active != item.id) {
                $scope.active = item.id;
            }
            else {
                $scope.active = null;
            }
        }

    }

})();
