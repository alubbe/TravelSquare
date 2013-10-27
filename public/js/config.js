//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/tours', {
            templateUrl: 'views/tours/view.html',
            reloadOnSearch: false
        }).
         when('/planning', {
            templateUrl: 'views/planning.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);