(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function (uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyB5nmqhScXjuLEpFhwwszBVsKmb2OWSoQ4',
                libraries: 'weather,geometry,visualization'
            });
        })
})();
