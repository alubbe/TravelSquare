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

      var autocompletemain = new maps.places.Autocomplete(document.getElementById('location'), {
       types: ["(cities)"],
       componentRestrictions: {country: 'de'}
      });

    }

    // Called by the form in the index.html
    $scope.submit = function(indexModel) {
      if (indexModel != null && indexModel.location != null && indexModel.days != null) {
        // Get the location name
        var location = indexModel.location;
        if ($('#location').val() != location) {
          // Use the location provided by the Google auto completion
          location = $('#location').val();
          if (location.indexOf(',') != -1) {
            // Remove everything except for the name of the city
            location = location.substring(0, location.indexOf(','));
          }
        }
        // Update the URL
        $location.path('/planning').
          search('location', location).
          search('days', indexModel.days);
      }
    };
  }
]);
