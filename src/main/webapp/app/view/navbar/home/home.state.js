(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function ($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    parent: 'navbar',
                    templateUrl: 'app/view/navbar/home/home.html',
                    controller: 'HomeController',
                    resolve: {
                        savePropsToVariable: ['$http', function ($http) {
                            return $http
                                .get('resources/errorcodes.properties')
                                .then(function (response) {
                                // console.log(response.data);
                                return response.data;
                            });
                        }]
                    }
                })
        })
})();
