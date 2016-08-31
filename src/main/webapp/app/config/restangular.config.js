(function () {
    'use strict';

    angular
        .module('sogo')
        .config(function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            var newBaseUrl = "http://localhost/";
            RestangularProvider.setBaseUrl("api/");
        })

})();
