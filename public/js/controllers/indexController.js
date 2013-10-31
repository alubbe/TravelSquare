angular.module('travelSquare.index', []).controller('IndexCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  '$routeParams',
  function ($scope, $rootScope, $http, $location, $routeParams) {
    console.log('Index controller loaded');

    // Remove all URL parameters
    for (var key in $routeParams) {
      $location.search(key, null);
    }

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
