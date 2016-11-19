(function () {
    'use strict';

    angular
        .module('sogo', [
            'ui.router',
            'ngResource',
            'ngStorage',
            'restangular',
            'uiGmapgoogle-maps',
            'ngAnimate',
            'angular-loading-bar',
            'checklist-model',
            'datatables',
            'pascalprecht.translate',
            'ui-notification'
        ])
        .run(run);

    run.$inject = ['stateHandler', 'Restangular', 'Notification'];

    function run(stateHandler, Restangular, Notification) {
        stateHandler.initialize();
        Restangular.setErrorInterceptor(function(response){
            Notification.error(response.data.description + '(' + response.status + ')');
        })
    }
})();
