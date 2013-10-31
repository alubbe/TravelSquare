angular.module('travelSquare.services', []).factory('Tours', [
	'$resource',
	function ($resource) {
		return $resource('tours2.json', {}, {
			get: {
				method: 'GET'
			}
		});
	}
]);
