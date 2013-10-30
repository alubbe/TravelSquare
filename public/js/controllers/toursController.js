angular.module('travelSquare.tours', []).controller('ToursCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $rootScope, $http, $location, $routeParams) {
		console.log('Tours controller loaded');

		// Load all tours
		$http({
			method: 'GET',
			url: 'tours2.json'
		}).success(function(data, status) {
			$scope.days = $scope.parseData(data);
			$scope.selectedDay = null;
			// Try to get the selected day from the URL
			var selectedDayIndex = ($routeParams.selectedDay) ? parseInt($routeParams.selectedDay) : 0;
			$scope.selectDay(selectedDayIndex);
		});

		// Called when loading the tours.html
		var mapsWrapper;
		$scope.setup = function() {
			console.log('Tours view loaded');
			// Add map
			mapsWrapper = new GoogleMapsWrapper();
			mapsWrapper.initializeMap();
		};

		// Parses the date fetched from the /itenary API end-point
		$scope.parseData = function(data) {
			var days = [];
			var spotCategoryFeatures = [
				{
					title: 'Morning',
					titleClass: 'head-color-red'
				}, {
					title: 'Lunch',
					titleClass: 'head-color-yellow'
				}, {
					title: 'Afternoon',
					titleClass: 'head-color-purple'
				}, {
					title: 'Evening',
					titleClass: 'head-color-green'
				}
			];
			// Iterate over all stop groups (days)
			for (var i = 0; i < data.stops.length; i++) {
				var day = {
					spots: []
				};
				var spotCategory = -1;
				// Iterate over all stop in this group (day)
				for (var j = 0; j < data.stops[i].length; j++) {
					if (j == 0 || j === 2 || j === 3 || j === 5) {
						// Select next spot category
						spotCategory++;
						day.spots.push({
							title: spotCategoryFeatures[spotCategory].title + ' Spots',
							titleClass: spotCategoryFeatures[spotCategory].titleClass,
							id: 'd' + i + '-s' + j,
							venues: []
						});
					}
					if (data.stops[i][j] !== null) {
						// Add venue to current category
						var venue = data.stops[i][j];
						if (!venue.name) {
							venue.name = 'unkown';
						}
						day.spots[spotCategory].venues.push(venue);
					}
				}
				// Save day
				days.push(day);
			}

			return days;
		};

		// Changes the selected day and updates the displayes tour on the map as well as the listed spots
		$scope.selectDay = function(index) {
			// Update data
			for (var i = 0; i < $scope.days.length; i++) {
				$scope.days[i].selected = false;
			}
			$scope.days[index].selected = true;
			$scope.selectedDay = $scope.days[index];
			$location.search('selectedDay', index);

			// Fetch all locations from the newly selected day
			var newLocations = [];
			for (var i = 0; i < $scope.selectedDay.spots.length; i++) {
				for (var j = 0; j < $scope.selectedDay.spots[i].venues.length; j++) {
					var venue = $scope.selectedDay.spots[i].venues[j];
					if (venue.location && venue.location.lat && venue.location.lng) {
						newLocations.push({
							lat: venue.location.lat,
							lng: venue.location.lng
						});
					}
				}
			}

			// Update the map
			mapsWrapper.updateRoute(newLocations);

			// Update the displayed spots
			window.setTimeout(function() {
				$scope.selectedModalBox = -1;
				$scope.selectModalBox(0, false);
			}, 15);
		};

		// Switches the opened spots box
		$scope.selectModalBox = function(index, animated) {
			var spots = $scope.selectedDay.spots;
			for (var i = 0; i < spots.length; i++) {
				if (i !== index || index === $scope.selectedModalBox) {
					// Close the box
					if (animated) {
						$('#modalbox-' + spots[i].id + '-c').animate({
							height: 0,
							padding: 0
						}, 300, function() {
							$(this).css({
								visibility: 'hidden',
								display: 'none'
							});
						});
					} else {
						$('#modalbox-' + spots[i].id + '-c').css({
							visibility: 'hidden',
							display: 'none',
							height: 0,
							padding: 0
						});
					}
				} else {
					// Open the box
					if (animated) {
						$('#modalbox-' + spots[i].id + '-c').css({
							visibility: 'visible',
							display: 'block'
						}).animate({
							height: spots[i].contentHeight + 'px',
							padding: '0 5px'
						}, 300);
					} else {
						$('#modalbox-' + spots[i].id + '-c').css({
							visibility: 'visible',
							display: 'block',
							height: spots[i].contentHeight + 'px',
							padding: '0 5px'
						});
					}
				}
			}

			// Save selected box
			$scope.selectedModalBox = index;
		};
	}
]);
