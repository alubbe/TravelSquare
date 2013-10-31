var travelSquareApp = angular.module('travelSquareApp', [
	'ui.route',
	'ngResource',
	'travelSquare.directives',
	'travelSquare.services',
	'travelSquare.index',
	'travelSquare.planning',
	'travelSquare.tours'
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
