(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('StatusController', StatusController);

    StatusController.$inject = ['$rootScope', '$scope', 'Restangular', 'containerToEdit', 'repairers', 'Notification' ,'$uibModalInstance'];

    function StatusController($rootScope, $scope, Restangular, containerToEdit, repairers, Notification, $uibModalInstance) {
        $scope.containerToEdit = containerToEdit;
        $scope.repairers = repairers;
        $scope.editContainer = editContainer;
        $scope.close = close;
        errorCodes(containerToEdit);

        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                Notification.success('Container ' + container.id +  ' edited');
                // $scope.getContainers();

            })
        }

        function errorCodes(container) {
            for(var sensor in container.sensors){
                var ec = container.sensors[sensor].errorCode;

                if(ec != 0){
                    container.sensors[sensor].message = $rootScope.propsInVariable[sensor][ec-1][ec];
                } else {
                    container.sensors[sensor].message = "-";
                }
            }
        }

        function close() {
            $uibModalInstance.close();
        }
    }
})();
