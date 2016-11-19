(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('StatusController', StatusController);

    StatusController.$inject = ['$scope', 'Restangular', 'containerToEdit', 'repairers'];

    function StatusController($scope, Restangular, containerToEdit, repairers) {
        $scope.containerToEdit = containerToEdit;
        $scope.repairers = repairers;
        $scope.editContainer = editContainer;

        function editContainer(container){
            Restangular.all('containers').customPUT(container).then(function () {
                Notification.success('Container ' + container.id +  ' edited');
                $scope.getContainers();

            })
        }
    }
})();
