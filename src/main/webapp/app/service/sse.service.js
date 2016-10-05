(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('SseService', SseService);

    function SseService() {
        var service = {
            register: register,
            unregister: unregister
        };

        var cache = [];

        function register(eventName, callback) {
            var index = cache.map(e => e.cb).indexOf(callback);
            if (index >= 0) {
                console.error("Unable to register. This callback has been already registered.")
            } else {
                var source = new EventSource("/api/sse");

                source.addEventListener(eventName, callback);
                source.onerror = event => console.log(event);
                source.onopen = event => console.log(event);

                cache.push({
                    source: source,
                    cb: callback
                })
            }
        }

        function unregister(callback) {
            var index = cache.map(e => e.cb).indexOf(callback);
            if (index >= 0) {
                var elem = cache.splice(index, 1)[0];
                elem.source.close();
            } else {
                console.error("Unable to unregister SseService. This callback is not registered.")
            }
        }

        return service;
    }
})();
