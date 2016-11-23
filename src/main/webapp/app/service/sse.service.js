(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('SseService', SseService);

    function SseService() {
        var cache = [];

        return {
            register: register,
            unregister: unregister
        };

        function register(eventName, callback) {
            var index = cache.map(entry => entry.callback).indexOf(callback);
            if (index >= 0) {
                console.error("Unable to register. This callback has been already registered.")
            } else {
                var source = new EventSource("/api/sse");
                source.addEventListener(eventName, callback);

                cache.push({
                    eventSource: source,
                    callback: callback
                })
            }
        }

        function unregister(callback) {
            var index = cache.map(entry => entry.callback).indexOf(callback);
            if (index >= 0) {
                var entry = cache.splice(index, 1)[0];
                entry.callback = angular.noop();
                entry.eventSource.onerror = () => entry.eventSource.close();
            } else {
                console.error("Unable to unregister SseService. This callback is not registered.")
            }
        }

    }
})();
