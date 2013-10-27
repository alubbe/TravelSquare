angular.
    module('mean.tours').
    controller('ToursController', ['$scope', '$routeParams', '$location', 'Global', 'Tours', function ($scope, $routeParams, $location, Global, Tours) {
        $scope.global = Global;

        $scope.test = 'OK';

        var mapsWrapper = null;
        $scope.setup = function() {
            Tours.get({}, function(tour) {
                // Add map
                mapsWrapper = new GoogleMapsWrapper();
                mapsWrapper.initializeMap();
                // Save tour and select first day
                $scope.tour = tour;
                $scope.selectDay(0);
            });
        };

        $scope.selectDay = function(index) {
            // Update selected day in the URL
            $location.search('day', index);
            for (var i in $scope.tour.days) {
                $scope.tour.days[i].selected = false;
            }
            var selectedDay = $scope.tour.days[index];
            selectedDay.selected = true;

            // Get data of current day
            var locations = [];
            for (var i in selectedDay.venues) {
                locations.push(selectedDay.venues[i].location);
            }

            // Display the new route on the map
            mapsWrapper.updateRoute(locations);
        };
    }]);
