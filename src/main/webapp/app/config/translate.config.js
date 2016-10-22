(function () {
    'use strict';

    angular
        .module('sogo')
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
