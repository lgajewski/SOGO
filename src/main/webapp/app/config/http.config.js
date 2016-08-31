(function() {
    'use strict';

    angular
        .module('sogo')
        .config(httpConfig);

    httpConfig.$inject = ['$urlRouterProvider', '$httpProvider'];

    function httpConfig($urlRouterProvider, $httpProvider) {

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.otherwise('/');

        // $httpProvider.interceptors.push('errorHandlerInterceptor');
        // $httpProvider.interceptors.push('authExpiredInterceptor');
        // $httpProvider.interceptors.push('notificationInterceptor');
    }
})();
