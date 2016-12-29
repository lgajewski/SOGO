(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('ContainerAddController', ContainerAddController);

    ContainerAddController.$inject = ['$scope', '$uibModalInstance', 'Restangular', 'Notification', 'mapProp'];

    function ContainerAddController($scope, $uibModalInstance, Restangular, Notification, mapProp) {
        $scope.close = close;
        $scope.containerToAdd = {};
        $scope.containerToAdd.type = 'blue';
        $scope.containerToAdd.sensors = {
            load: {
                value: 0.0
            }
        };

        $scope.addContainer = function (container) {
            Restangular.all('containers').customPOST(container).then(function () {
                Notification.success('Container added');
                marker.setMap(null);
                $scope.containerToAdd = {};
                $scope.containerToAdd.type = 'blue';
                $scope.containerToAdd.sensors = {
                    load: {
                        value: 0.0
                    }
                };
                close();
            })
        };

        var marker;

        $scope.initMap = function () {
            $scope.containerMap = new google.maps.Map(document.getElementById("map-canvas-addcontainer"), mapProp);
            resizeMap($scope.containerMap);

            google.maps.event.addListener($scope.containerMap, 'click', function (event) {
                addMarker(event.latLng, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                    $scope.containerMap, $scope.containerToAdd);
            });

            $scope.$watch('containerToAdd.type', function () {
                if (marker != null) {
                    addMarker(marker.position, 'assets/images/ic_map_trash_' + $scope.containerToAdd.type + '.png',
                        $scope.containerMap, $scope.containerToAdd);
                }
            });

            function resizeMap(map) {
                if (typeof map == "undefined") return;
                setTimeout(function () {
                    resizingMap(map);
                }, 400);
            }

            function resizingMap(map) {
                if (typeof map == "undefined") return;
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            }
        };

        function addMarker(latLng, icon, map, item) {
            //clear the previous marker and circle.
            if (marker != null) {
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

        function close() {
            $uibModalInstance.close();
        }
    }
})();
