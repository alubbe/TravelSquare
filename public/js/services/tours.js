angular.
	module('mean.tours').
	factory('Tours', ['$resource', function ($resource) {
		return $resource('tours2.json', {}, {
		// return $resource('/itenary', {}, {
			get: {
				method: 'GET',
				params: {},
				isArray: false
			}
		});
	}]);
