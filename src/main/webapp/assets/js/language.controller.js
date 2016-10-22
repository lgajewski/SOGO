(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('LanguageSwitchController', LanguageSwitchController);

    $rootScope.lang = 'en';

    function LanguageSwitchController($scope, $rootScope, $translate){

        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };

        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            var language = data.language;

            $rootScope.lang = language;
        });
    }
})();
