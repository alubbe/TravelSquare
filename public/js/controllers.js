var travelSquareControllers = angular.module('travelSquareControllers', []);

travelSquareControllers.controller('IndexCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$location',
	function ($scope, $rootScope, $http, $location) {
		console.log('Index controller loaded');

		// Called when loading the index.html
		$scope.setup = function() {
			console.log('Index view loaded');
		}

		// Called by the form in the index.html
		$scope.submit = function(indexModel) {
			// Update the URL
			$location.path('/planning').
				search('location', indexModel.location).
				search('days', indexModel.days);
		}
	}
]);

travelSquareControllers.controller('PlanningCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $rootScope, $http, $location, $routeParams) {
		console.log('Planning controller loaded');
		$scope.test = 'planning OK';

		// TODO
		console.log('TODO: Load the planning data...')

		// Called when loading the index.html
		$scope.setup = function() {
			console.log('Planning view loaded');
		}

		// Called by the form in the planning.html
		$scope.submit = function(planningModel) {
			// Update the URL
			$location.path('/tours');
		};
	}
]);

travelSquareControllers.controller('ToursCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$routeParams',
	function ($scope, $rootScope, $http, $routeParams) {
		console.log('Tours controller loaded');
		$scope.test = 'tours OK';

		// TODO
		console.log('TODO: Load the tours data...')

		// Called when loading the tours.html
		$scope.setup = function() {
			console.log('Tours view loaded');
		}
	}
]);
