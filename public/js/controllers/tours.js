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
                $scope.tour = $scope.parseData(tour);
                $scope.selectDay(0);
            });
        };

        // The colors and titles for the venue sections
        var titleBarColors = [
            'rgb(242,77,96)',
            'rgb(250,202,10)',
            'rgb(181,60,94)',
            'rgb(69,130,94)'
        ];
        var titleBarTitles = [
            'Morning Spots',
            'Lunch Spots',
            'Afternoon Spots',
            'Evening Spots'
        ];

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
                if (typeof selectedDay.venues[i] == 'function' || !selectedDay.venues[i].location) {
                    continue;
                }
                // Save location
                locations.push(selectedDay.venues[i].location);
                // Add venue to a section
                if (!currentSection || currentSection.code !== selectedDay.venues[i].timeCode) {
                    // Create a new section
                    var code = selectedDay.venues[i].timeCode;
                    currentSection = {
                        code: code,
                        selected: (i == 0),
                        title: titleBarTitles[code],
                        titleBarColor: titleBarColors[code],
                        venues: []
                    };
                    $scope.sections.push(currentSection);
                }
                currentSection.venues.push(selectedDay.venues[i]);
            }

            // Update the heights of all sections
            for (var i in $scope.sections) {
                $('#c'+i).css({
                    height: $scope.getHeightOfSection(i)+'px'
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

        $scope.parseData = function(data) {
            var days = [];
            for (var i in data) {
                var day = {
                    date: '',
                    venues: []
                };
                var stops = data[i].stops;
                for (var j in stops) {
                    // Determine time code
                    var timeCode = 3;
                    if (stops[j].timeframe.startsWith('Morning')) {
                        timeCode = 0;
                    } else if (stops[j].timeframe.startsWith('Lunch')) {
                        timeCode = 1;
                    } else if (stops[j].timeframe.startsWith('Afternoon')) {
                        timeCode = 2;
                    }
                    // Build address
                    var address = '';
                    var name = '<unknown>';
                    if (stops[j].venue && stops[j].venue.location) {
                        address = stops[j].venue.location.address + ', ' + stops[j].venue.location.city + ', ' + stops[j].venue.location.country;
                        name = stops[j].venue.name;
                    }
                    // Create venue
                    day.venues.push({
                        name: name,
                        location: {
                            lat: stops[j].lat || stops[j].venue.location.lat,
                            lng: stops[j].lng || stops[j].venue.location.lng
                        },
                        timeCode: timeCode,
                        address: address,
                        imageUrl: '',
                        blurb: ''
                    });
                }
                days.push(day);
            }
            return days;
        }

        $scope.getHeightOfSection = function(index) {
            return $scope.sections[index].venues.length * 75;
        };

    }]);
