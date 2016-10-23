(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('LanguageSwitchController', LanguageSwitchController);
    
    function LanguageSwitchController($scope, $rootScope, $translate){
        $rootScope.lang = 'en';

        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };

        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            var language = data.language;

            $rootScope.lang = language;
        });
    }
})();
