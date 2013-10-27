angular.
    module('mean.tours').
    factory('Tours', ['$resource', function ($resource) {
        return $resource('tours.json', {}, {
            get: {
                method: 'GET',
                params: {},
                isArray: false
            }
        });
    }]);
