

angular.module('mean.system').controller('SplashCrtl', ['$http','$scope', 'Global', function ($http,$scope, Global) {
    $scope.global = Global;
    $scope.test = "SplashController";
        
}]);





angular.module('mean.system').controller('IndexController', ['$http','$scope', 'Global', function ($http,$scope, Global) {
   $scope.global = Global;
    $scope.test = "Indexcontroller";
    
//    $http.get('').success(function(data) {
//  $scope.list = data;
//});
    
    
    
    var url = 'https://api.foursquare.com/v2/venues/search?callback=JSON_CALLBACK&client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815&ll=40.7,-74&query=' + $scope.venuename ;

	 TSxhr($http, $scope, url, "list");


    // Consider the ? ?callback=JSON_CALLBACK at any CALL!
    var venueurl1 = 'https://api.foursquare.com/v2/venues/52155e9d11d2c369404df14e?callback=JSON_CALLBACK&client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815&ll=40.7,-74&query=sushi';
    var venueurl2 = 'https://api.foursquare.com/v2/venues/52155e9d11d2c369404df14e?callback=JSON_CALLBACK&client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815&ll=40.7,-74&query=sushi';

    

   $scope.venueDetails = [];
   TSxhrPush($http, $scope, venueurl1, "venueDetails");
   TSxhrPush($http, $scope, venueurl2, "venueDetails");
  
    
    
    function TSxhr($http, $scope, url, variablename){
            $http.jsonp(url)               
       			  .success(function (data) {
              $scope[variablename] = data;
        }).error(function (data, status, headers, config) {

             alert('Please try again soon.');  
             return;       
        });
         
    return;
    }
    
    
        function TSxhrPush($http, $scope, url, arrayname){
            $http.jsonp(url)               
       			  .success(function (data) {
              $scope[arrayname].push(data);
             // console.log($scope.venueDetails)
        }).error(function (data, status, headers, config) {

             alert('Please try again soon.');  
             return;       
        });
         
    return;
    }
    
    
    
    
function AccordionDemoCtrl($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: "Dynamic Group Header - 1",
      content: "Dynamic Group Body - 1"
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group	 Body - 2"
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };
}
    
}]);

