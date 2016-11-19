(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$rootScope', 'currentUser', 'errorCodes',
        'brokenContainers', 'notificationsRead',  'Auth'];

    function NavbarController($scope, $rootScope, currentUser, errorCodes,
                              brokenContainers, notificationsRead, Auth) {
        this.logout = Auth.logout;
        $scope.notificationsRead = notificationsRead;
        $scope.errorsCounter = 0;
        $scope.markAsRead = markAsRead;
        $rootScope.currentUser = currentUser;
        $scope.errorCodeDescriptions = errorCodes;
        $scope.brokenContainers = brokenContainers;

        $scope.$on('$viewContentLoaded', function(){
            $scope.$emit('onNavbarLoaded');
        });

        // $(function () {
        //     var navMain = $("#nav-main");
        //     navMain.on("click", "a", null, function () {
        //         navMain.collapse('hide');
        //     });
        // });

        function markAsRead(container){
            var index = $scope.brokenContainers.indexOf(container);
            if(!localStorage.notificationsRead){
                localStorage.notificationsRead = [];
            }
            if(index > -1) {
                $scope.brokenContainers.splice(index, 1);
                $scope.notificationsRead.push(container);
                sessionStorage.setItem("notificationsRead", JSON.stringify($scope.notificationsRead));
            }
        }


    }
})();
