(function () {
    'use strict';

    angular
        .module('sogo')
        .service('ActiveItemService', ActiveItemService);

    ActiveItemService.$inject = [];

    function ActiveItemService() {
        var activeObject = {
            id: 0,
            options: {
                draggable: false,
                icon: ''
            },
            map: {
                center: {latitude: 50.0613357, longitude: 19.9379844},
                zoom: 13

            }
        };

        return {
            getObject: function () {
                return activeObject;
            }
        }
    }
})();
