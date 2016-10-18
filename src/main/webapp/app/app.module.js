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
            'pascalprecht.translate'
        ])
        .config(['$translateProvider', function($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: '/translations/',
                suffix: '.json'
            })
            .preferredLanguage('en')
            .useMissingTranslationHandlerLog();
    }])
})();
