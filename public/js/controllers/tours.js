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
            var currentSection;
            $scope.sections = []
            for (var i in selectedDay.venues) {
                // Save location
                locations.push(selectedDay.venues[i].location);
                // Add venue to a section
                if (!currentSection || currentSection.code !== selectedDay.venues[i].timeCode) {
                    // Create a new section
                    currentSection = {
                        code: selectedDay.venues[i].timeCode,
                        selected: (i == 0),
                        venues: []
                    };
                    $scope.sections.push(currentSection);
                }
                currentSection.venues.push(selectedDay.venues[i]);
            }

            // Update the heights of all sections
            for (var i in $scope.sections) {
                $('#c'+i).css({
                    height: $scope.getHeightOfSection(index)+'px'
                });
            }

            // TODO: check why sectio is not opening
            $scope.openSection(0);

            // Display the new route on the map
            mapsWrapper.updateRoute(locations);
        };

        $scope.openSection = function(index) {
            for (var i in $scope.sections) {
                if (i == index) {
                    // Display new section
                    $('#c'+i).css({
                        visibility: 'visible',
                        display: 'block'
                    }).animate({
                        height: $scope.getHeightOfSection(index)+'px',
                        padding: '5px'
                    }, 300);
                    continue;
                }
                // Hide all other sections
                $scope.sections[i].selected = false;
                $('#c'+i).animate({
                    height: 0,
                    padding: '0 5px'
                }, 300, function () {
                    $(this).css({
                        visibility: 'hidden',
                        display: 'none'
                    });
                });
            }
            $scope.sections[index].selected = true;
        };

        $scope.getHeightOfSection = function(index) {
            return $scope.sections[index].venues.length * 23;
        };

    }]);
