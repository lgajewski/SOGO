(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('TranslateService', TranslateService);

    TranslateService.$inject = [];

    $rootScope.lang = 'en';

    function TranslateService() {
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };

        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            $rootScope.lang = data.language;
        });
    }
})();
