angular.module('travelSquare.index', []).controller('IndexCtrl', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  function ($scope, $rootScope, $http, $location) {
    console.log('Index controller loaded');

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
