angular.module('travelSquare.services', []).factory('Tours', [
	'$resource',
	function ($resource) {
		return $resource('/itenary', {}, {
			get: {
				method: 'POST'
			}
		});
	}
]);
