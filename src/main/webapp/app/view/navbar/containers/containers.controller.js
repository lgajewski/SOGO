(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'containers', 'repairers', 'containersToRepair',
        'Restangular', 'ActiveItemService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        '$filter' , 'Notification', '$uibModal'];

    function ContainersController($scope, containers, repairers, containersToRepair,
                                  Restangular, ActiveItemService, DTOptionsBuilder, DTColumnDefBuilder,
                                  $filter, Notification, $uibModal) {
        $scope.items = containers;
        $scope.setActiveObject = setActiveObject;
        $scope.editContainer = editContainer;
        $scope.setContainerToEdit = setContainerToEdit;
        $scope.showDetail = showDetail;
        $scope.deleteContainer = deleteContainer;
        $scope.getContainers = getContainers;
        $scope.addContainer = addContainer;
        $scope.isError = isError;
        $scope.activeObject = ActiveItemService.getObject();
        // $scope.getContainers();
        $scope.containerToAdd = {};
        $scope.containerToEdit = {};
        $scope.repairContainer = repairContainer;
        $scope.containersToRepair = containersToRepair;
        $scope.containerToAdd.type = 'blue';
        $scope.containerToAdd.sensors = {
            load: {
                value: 0.0
            }
        };
        $scope.repairers = repairers;


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5).notSortable()
        ];

        $scope.dtColumnDefsSensors = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
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
            if($scope.containerToEdit && $scope.containerToEdit.sensors){

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

        function isError(container){
            for(var index in container.sensors){
                if(container.sensors[index].errorCode > 0){
                    return 1;
                }
            }
            return 0;
        }

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
                    + '<td>' + $filter('translate')('TYPE') + ':</td>'
                    + '<td>' + item.type + '</td>'
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
                Notification.success('Container added');
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

        function setContainerToEdit(container) {
            $scope.containerToEdit = _.cloneDeep(container);
            $('#repairersSelectPicker').selectpicker('refresh');
        }

        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                Notification.success('Container ' + container.id +  ' edited');
                $scope.getContainers();

            })
        }


        function deleteContainer(container) {
            Restangular.all('containers').one(container.id).remove().then(function () {
                $scope.getContainers();
                Notification.success('Container ' + container.id + ' deleted');
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

        function repairContainer(container){
            Restangular.all('containers/' + container.id + '/repair').customPOST().then(function (data) {
                getContainersToRepair();
                Notification.success('Container repaired');
            })
        }

        function getContainersToRepair(){
            Restangular.all('containers/toRepair').getList().then(function (data) {
                $scope.containersToRepair = data;

            });
        }

        $scope.animationsEnabled = true;
        $scope.open = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'myContainerStatusModalLabel',
                templateUrl: 'app/view/navbar/containers/containerStatusModal.html',
                controller: 'StatusController',
                resolve: {
                    containerToEdit: function () {
                        return $scope.containerToEdit;
                    },
                    repairers: function() {
                        return $scope.repairers;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                console.log('Modal xxx at: ' + new Date());
            }, function () {
                getContainers();
                 console.log('Modal dismissed at: ' + new Date());
            });
        };

    }

})();
