angular.module('travelSquare.index', []).controller('IndexCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  '$routeParams',
  '$window',
  function ($scope, $rootScope, $http, $location, $routeParams, $window) {
    console.log('Index controller loaded');

    // Remove all URL parameters
    for (var key in $routeParams) {
      $location.search(key, null);
    }

    // Called when loading the index.html
    $scope.setup = function() {
      console.log('Index view loaded');
      var maps = $window.google.maps;

      //var autocompletemain = new maps.places.Autocomplete(document.getElementById('location'), {
      //  types: ["(cities)"],
      //  componentRestrictions: {country: 'de'}
      //});

    }

    // Called by the form in the index.html
    $scope.submit = function(indexModel) {
      //TODO: add error handling if some input is missing

      if(indexModel != null && indexModel.location != null && indexModel.days != null)
        // Update the URL
        $location.path('/planning').
          search('location', indexModel.location).
          search('days', indexModel.days);
    }
  }
]);
