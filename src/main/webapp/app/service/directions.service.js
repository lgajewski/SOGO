(function () {
    'use strict';

    angular
        .module('sogo')
        .factory('DirectionsService', DirectionsService);

    DirectionsService.$inject = ['uiGmapGoogleMapApi'];

    function DirectionsService(uiGmapGoogleMapApi) {
        var service = {
            displayRoute: displayRoute
        };

        var directionsDisplay;
        var directionsService;

        uiGmapGoogleMapApi.then(function (maps) {
            directionsDisplay = new maps.DirectionsRenderer();
            directionsService = new maps.DirectionsService();
        });

        return service;

        function displayRoute(gmap, route) {
            var wayptsExist = route.length > 0;
            if (!wayptsExist) {
                directionsDisplay.setMap(null);
                return;
            }

            //====================
            var batches = [];
            var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
            var itemsCounter = 0;
            directionsDisplay.setMap(gmap);
            while (wayptsExist) {
                var subBatch = [];
                var subitemsCounter = 0;

                for (var j = itemsCounter; j < route.length; j++) {
                    // console.log(itemsCounter + subitemsCounter + ": " + route[j].latitude + ", " +  route[j].longitude);
                    subitemsCounter++;
                    subBatch.push({
                        location: new window.google.maps.LatLng(route[j].latitude, route[j].longitude),
                        stopover: true
                    });
                    if (subitemsCounter == itemsPerBatch)
                        break;
                }

                itemsCounter += subitemsCounter;
                batches.push(subBatch);
                wayptsExist = itemsCounter < route.length;
                // If it runs again there are still points. Minus 1 before continuing to
                // start up with end of previous tour leg
                itemsCounter--;
            }

            // now we should have a 2 dimensional array with a list of a list of waypoints
            var combinedResults;
            var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
            var directionsResultsReturned = 0;

            for (var k = 0; k < batches.length; k++) {
                var lastIndex = batches[k].length - 1;
                var start = batches[k][0].location;
                // console.log("Start: " + start.lat() + ", " + start.lng());
                var end = batches[k][lastIndex].location;
                // console.log("End: " + end.lat() + ", " + end.lng());
                // trim first and last entry from array
                var waypts = [];
                waypts = batches[k];
                waypts.splice(0, 1);
                waypts.splice(waypts.length - 1, 1);

                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    optimizeWaypoints: false,
                    travelMode: window.google.maps.TravelMode.DRIVING
                };

                // directionsService.route(request, function (response, status) {
                //     console.log('directions found');
                //     if (status === google.maps.DirectionsStatus.OK) {
                //         $scope.directionsDisplay.setDirections(response);
                //     } else {
                //         console.log('Directions request failed due to ' + status);
                //     }
                // });
                (function (kk) {
                    directionsService.route(request, function (result, status) {
                        var pointsArray = [];


                        if (status == window.google.maps.DirectionsStatus.OK) {

                            var unsortedResult = {order: kk, result: result};
                            unsortedResults.push(unsortedResult);

                            directionsResultsReturned++;

                            if (directionsResultsReturned == batches.length) {
                                unsortedResults.sort(function (a, b) {
                                    return parseFloat(a.order) - parseFloat(b.order);
                                });
                                var count = 0;
                                for (var key in unsortedResults) {
                                    if (unsortedResults[key].result != null) {
                                        if (unsortedResults.hasOwnProperty(key)) {
                                            console.log(key);
                                            console.log(unsortedResults[key].result.request.origin.lat());
                                            if (count == 0)
                                                combinedResults = unsortedResults[key].result;
                                            else {

                                                combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
                                                combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
                                            }
                                            count++;
                                        }
                                    }
                                }
                                directionsDisplay.setDirections(combinedResults);
                            }
                        }
                    });
                })(k);
            }
        }

    }
})();
