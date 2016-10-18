(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'Restangular', 'ActiveItemService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function ContainersController($scope, Restangular, ActiveItemService, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.setActiveObject = setActiveObject;
        $scope.editContainer = editContainer;
        $scope.setContainerToEdit = setContainerToEdit;
        $scope.showDetail = showDetail;
        $scope.deleteContainer = deleteContainer;
        $scope.getContainers = getContainers;
        $scope.addContainer = addContainer;
        $scope.activeObject = ActiveItemService.getObject();
        $scope.getContainers();
        $scope.containerToAdd = {};
        $scope.containerToAdd.type = 'blue';
        $scope.containerToAdd.sensors = {
            load: {
                value: 0.0
            }
        };


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

        var mapCenter = new google.maps.LatLng(50.0613356, 19.9379844);

        $scope.defaultMapProperties = {
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

        $scope.containerAddMap = new google.maps.Map(document.getElementById("map-canvas-addcontainer"), $scope.defaultMapProperties);
        $scope.containerEditMap = new google.maps.Map(document.getElementById("map-canvas-editcontainer"), $scope.defaultMapProperties);
        $scope.containerShowMap = new google.maps.Map(document.getElementById("map-canvas-showcontainer"), $scope.defaultMapProperties);

        var marker;


        google.maps.event.addListener($scope.containerAddMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                $scope.containerAddMap, $scope.containerToAdd);
        });

        google.maps.event.addListener($scope.containerEditMap, 'click', function(event){
            addMarker(event.latLng, 'assets/images/trash' + parseInt($scope.containerToEdit.sensors.load.value / 10) + '_' + $scope.containerToEdit.type + '.png',
                $scope.containerEditMap, $scope.containerToEdit);
        });

        $scope.$watch('containerToAdd.type', function(){
            if(marker != null){
                addMarker(marker.position, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                    $scope.containerAddMap, $scope.containerToAdd);
            }
        });

        $scope.$watch('containerToEdit.type', function(){
            if(marker != null){
                addMarker(marker.position, 'assets/images/trash' + parseInt($scope.containerToEdit.sensors.load.value / 10) + '_' + $scope.containerToEdit.type + '.png',
                    $scope.containerEditMap, $scope.containerToEdit);
            }
        });

        $scope.$watch('containerToEdit.sensors.load.value', function(){
            if($scope.containerToEdit){

                $scope.containerToEdit.sensors.load.value = parseFloat($scope.containerToEdit.sensors.load.value);
            }
            if(marker != null){
                addMarker(marker.position, 'assets/images/trash' + parseInt($scope.containerToEdit.sensors.load.value / 10) + '_' + $scope.containerToEdit.type + '.png',
                    $scope.containerEditMap, $scope.containerToEdit);
            }
        });

        $('#myAddModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.containerAddMap);
        });

        $('#myAddModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        $('#myEditModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.containerEditMap);
            var pos = new google.maps.LatLng($scope.containerToEdit.location.latitude, $scope.containerToEdit.location.longitude);
            addMarker(pos, 'assets/images/trash' + parseInt($scope.containerToEdit.sensors.load.value / 10) + '_' + $scope.containerToEdit.type + '.png',
                $scope.containerEditMap, $scope.containerToEdit);
            $scope.containerEditMap.center = new google.maps.LatLng($scope.containerToEdit.location.latitude, $scope.containerToEdit.location.longitude);

        });

        $('#myEditModalLabel').on('hidden.bs.modal', function() {
            if(marker != null){
                marker.setMap(null);
            }
        });

        $('#myShowLocationModalLabel').on('show.bs.modal', function() {
            //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
            resizeMap($scope.containerShowMap);
            var pos = new google.maps.LatLng($scope.containerToEdit.location.latitude, $scope.containerToEdit.location.longitude);
            addMarker(pos, 'assets/images/trash' + parseInt($scope.containerToEdit.sensors.load.value / 10) + '_' + $scope.containerToEdit.type + '.png',
                $scope.containerShowMap, $scope.containerToEdit);
            $scope.containerShowMap.center = new google.maps.LatLng($scope.containerToEdit.location.latitude, $scope.containerToEdit.location.longitude);

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
                    + '<td>Type:</td>'
                    + '<td>' + item.type + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>Location:</td>'
                    + '<td>' + item.address + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>Capacity:</td>'
                    + '<td>' + item.capacity + 'kg</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>Load:</td>'
                    + '<td>' + item.sensors.load.value.toFixed(2) + '%</td>'
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

        function addContainer(container){
            Restangular.all('containers').customPOST(container).then(function () {
                getContainers();
                if(marker != null){
                    marker.setMap(null);
                }
                $scope.containerToAdd = {};
                $scope.containerToAdd.type = 'blue';
                $scope.containerToAdd.sensors = {
                    load: {
                        value: 0.0
                    }
                };
            })
        }

        function setActiveObject(item) {
            $scope.activeObject.coords = item.location;
            $scope.activeObject.id = item.id;
            $scope.activeObject.map.center.latitude = item.location.latitude;
            $scope.activeObject.map.center.longitude = item.location.longitude;
            $scope.activeObject.options.icon = 'assets/images/ic_map_trash_' + item.type + '.png';
        }

        function setContainerToEdit(container){
            $scope.containerToEdit = _.clone(container)

        }

        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                $scope.getContainers();
            })
        }


        function deleteContainer(container) {
            Restangular.all('containers').one(container.id).remove().then(function () {
                $scope.getContainers();
            })
        }

        function getContainers() {
            Restangular.all('containers').getList().then(function (data) {
                $scope.items = data;
                for(var i=0;i<$scope.items.length;i++){
                    $scope.items[i].sensors.load.value = parseFloat($scope.items[i].sensors.load.value);
                }
            })
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
