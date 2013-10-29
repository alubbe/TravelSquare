var travelSquareApp = angular.module('travelSquareApp', [
	'ui.route',
	'travelSquareControllers'
]);

travelSquareApp.config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/planning', {
			templateUrl: 'views/planning.html',
			controller: 'PlanningCtrl'
		}).when('/tours', {
			templateUrl: 'views/tours.html',
			controller: 'ToursCtrl'
		}).when('/', {
			templateUrl: 'views/index.html',
			controller: 'IndexCtrl'
		}).otherwise({
			redirectTo: '/'
		});
	}
]);
