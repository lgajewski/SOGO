'use strict';

angular.module('sogo.services',[])

    .factory('GreetingService',function($resource) {
        return $resource('http://rest-service.guides.spring.io/greeting');
    })
    .factory('ActiveItemService',function() {
        var activeObject = {
            id: 0,
            options: {
                draggable: false,
                icon: ''
            },
            map: {
                center: { latitude: 50.0613357, longitude: 19.9379844 },
                zoom: 13

            }
        };

        return {
            getObject: function() {
                return activeObject;
            }
        }
    });



