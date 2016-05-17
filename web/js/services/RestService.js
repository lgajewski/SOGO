'use strict';

app.factory('RestService', function ($http, $q) {

    function getFunctionFactory(url) {
        return function () {
            var defer = $q.defer();

            $http.get(url).success(function (result) {
                defer.resolve(result);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }
    }

    function postFunctionFactory(url) {
        return function (obj) {
            var defer = $q.defer();

            $http.post(url, obj).success(function (result) {
                defer.resolve(result);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }
    }

    function putFunctionFactory(url) {
        return function (obj) {
            var defer = $q.defer();

            $http.put(url, obj).success(function (result) {
                defer.resolve(result);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }
    }

    function deleteFunctionFactory(url) {
        return function (obj) {
            var defer = $q.defer();

            $http.delete(url, obj).success(function (result) {
                defer.resolve(result);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }
    }

    return {
        getFunctionFactory: getFunctionFactory,
        postFunctionFactory: postFunctionFactory,
        putFunctionFactory: putFunctionFactory,
        deleteFunctionFactory: deleteFunctionFactory
    }
})
