(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('LanguageSwitchController', LanguageSwitchController);

    $rootScope.lang = 'en';

    $rootScope.default_float = 'left';
    $rootScope.opposite_float = 'right';

    $rootScope.default_direction = 'ltr';
    $rootScope.opposite_direction = 'rtl';

    function LanguageSwitchController($scope, $rootScope, $translate){

        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };

        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            var language = data.language;

            $rootScope.lang = language;

            $rootScope.default_direction = language === 'ar' ? 'rtl' : 'ltr';
            $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'ar' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';
        });
    }
})();
