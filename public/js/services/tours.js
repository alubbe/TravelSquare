angular.module('travelSquare.services', []).factory('Tours', [
	'$resource',
	function ($resource) {
		return $resource('/itenary', {}, {
			get: {
				method: 'POST',
				isArray: false
			}
		});
		// return $resource('tours2.json', {}, {
		// 	get: {
		// 		method: 'GET',
		// 		isArray: false
		// 	}
		// });
	}
]);
