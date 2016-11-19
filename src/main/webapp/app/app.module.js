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
            'ui-notification',
            'ui.bootstrap'
        ])
        .run(run);

    run.$inject = ['stateHandler', 'Restangular', 'Notification'];

    function run(stateHandler, Restangular, Notification) {
        stateHandler.initialize();
        Restangular.setErrorInterceptor(function(response){
            if ( response.status == 401 ) {
                Notification.error("Sign in to access the site.");
            } else {
                Notification.error(response.data.description + '(' + response.status + ')');
            }
        })
    }
})();
