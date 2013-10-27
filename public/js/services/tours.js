angular.
    module('mean.tours').
    factory('Tours', ['$resource', function ($resource) {
        return $resource('tours.json', {}, {
        // return $resource('/itenary', {}, {
            get: {
                method: 'GET',
                params: {},
                isArray: false
            }
        });
    }]);
