(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 6000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'top'
            });
        });
})();



