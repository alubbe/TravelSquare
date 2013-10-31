angular.module('travelSquare.tours', []).controller('ToursCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $rootScope, $http, $location, $routeParams) {
		// console.log('Tours controller loaded');

		// TODO: REMOVE DUMMY DATA
		$rootScope.selectedvenues = {
			sights: [
				{
					name: 'Dummy 1',
					location: {
						address: "Olot, 13, 08024  Barcelona",
						lat: 44.1,
						lng: 18.1
					},
					rating: 8.2,
					likes: 10,
					picture_url: 'kitten.jpg',
					fs_url: 'https://foursquare.com/v/...',
					fs_id: 'abc123'
				}
			],
			arts: [
				{
					name: 'Dummy 2',
					location: {
						address: "Olot, 13, 08024  Barcelona",
						lat: 44.04,
						lng: 18.01
					},
					rating: 8.2,
					likes: 10,
					picture_url: 'kitten.jpg',
					fs_url: 'https://foursquare.com/v/...',
					fs_id: 'def456'
				},
				{
					name: 'Dummy 3',
					location: {
						address: "Olot, 13, 08024  Barcelona",
						lat: 44.09,
						lng: 18.12
					},
					rating: 8.2,
					likes: 10,
					picture_url: 'kitten.jpg',
					fs_url: 'https://foursquare.com/v/...',
					fs_id: 'ghi789'
				}
			],
			outdoors: [
			],
			dinner: [
				{
					name: 'Dummy 4',
					location: {
						address: "Olot, 13, 08024  Barcelona",
						lat: 44.25,
						lng: 18.03
					},
					rating: 8.2,
					likes: 10,
					picture_url: 'kitten.jpg',
					fs_url: 'https://foursquare.com/v/...',
					fs_id: 'peter'
				},
			],
			nightlife: [
			],
			shopping: [
			],
			lunch: [
			],
			cafe: [
			],
			breakfast: [
			]
		};
		$routeParams.location = 'Berlin';
		$routeParams.days = '2';
		// END TODO

		// Check parameters
		if (!$routeParams.location || $routeParams.location.length == 0
			|| !$routeParams.days || $routeParams.days.length == 0
			|| !$rootScope.selectedvenues) {
			// Invalid parameters -> redirect to index
			$location.path('/');
			return;
		}

		// Prepare payload
		var payload = {
			city: ($routeParams.location) ? $routeParams.location : '',
			numberOfCalendarDays: ($routeParams.days) ? parseInt($routeParams.days) : ''
		};
		for (var key in $rootScope.selectedvenues) {
			payload[key] = $rootScope.selectedvenues[key];
		};
		// console.log(payload);

		// Show loading overlay
		$('body').append(
			'<div id="loading-overlay">'+
				'<div class="text">Generating your itinerary...</div>'+
				'<img src="../img/loading-indicator.gif" alt="Loading..." class="animation" />'+
			'</div>'
		);

		// Load all tours
		$http({
			url: '/itenary',
			method: 'POST',
			data: payload
		}).success(function(data, status) {
			console.log(status);
			console.log(data);
			// Remove the loading overlad
			$('#loading-overlay').remove();
			// Parse the response
			$scope.days = $scope.parseData(data);
			$scope.selectedDay = null;
			// Try to get the selected day from the URL
			var selectedDayIndex = ($routeParams.selectedDay) ? parseInt($routeParams.selectedDay) : 0;
			$scope.selectDay(selectedDayIndex);
		}).error(function(data, status) {
			console.log('ERROR: Failed to generate tours...');
			$location.path('/');
		});

		// Called when loading the tours.html
		var mapsWrapper;
		$scope.setup = function() {
			// console.log('Tours view loaded');
			// Add map
			mapsWrapper = new GoogleMapsWrapper();
			mapsWrapper.initializeMap('tour-map-canvas');
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
			for (var i = 0; i < data.length; i++) {
				var day = {
					spots: []
				};
				var spotCategory = -1;
				var currentSpot = null;
				// Iterate over all stop in this group (day)
				for (var j = 0; j < data[i].length; j++) {
					if (j == 0 || j === 2 || j === 3 || j === 5) {
						// Select next spot category
						spotCategory++;
						if (currentSpot !== null && currentSpot.venues.length > 0) {
							day.spots.push(currentSpot);
						}
						currentSpot = {
							title: spotCategoryFeatures[spotCategory].title + ' Spots',
							titleClass: spotCategoryFeatures[spotCategory].titleClass,
							id: 'd' + i + '-s' + j,
							venues: []
						};
					}
					if (data[i][j] !== null) {
						// Add venue to current category
						var venue = data[i][j];
						if (!venue.name) {
							venue.name = 'unkown';
						}
						venue.location.address = 'asjdhakjsdhakjshdjka, dasjdad ,s ajdashd ';
						currentSpot.venues.push(venue);
					}
				}
				if (currentSpot !== null && currentSpot.venues.length > 0) {
					day.spots.push(currentSpot);
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
							height: 0
						});
					}
				} else {
					// Open the box
					if (animated) {
						$('#modalbox-' + spots[i].id + '-c').css({
							visibility: 'visible',
							display: 'block'
						}).animate({
							height: spots[i].contentHeight + 'px'
						}, 300);
					} else {
						$('#modalbox-' + spots[i].id + '-c').css({
							visibility: 'visible',
							display: 'block',
							height: spots[i].contentHeight + 'px'
						});
					}
				}
			}

			// Save selected box
			$scope.selectedModalBox = index;
		};
	}
]);
