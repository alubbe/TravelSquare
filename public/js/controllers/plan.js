  function PlanCtrl($scope,$http,$timeout,$location) {
    $scope.test = "Controller ok";
    // $scope.city =  $scope.$location.search().location ;
    // $scope.days =  $scope.$location.search().location ;   
    $scope.city = TSglobal_city;
    

    urlparams = window.location.href.split("?")[1].split("&");
    console.log(urlparams);
    var param_city =  urlparams[0].split("=")[1];
    var param_days =  urlparams[1].split("=")[1];
    if (param_city){
       $scope.city = decodeURI(param_city);
    };
    if (param_days){
       $scope.days = decodeURI(param_days);
    }


     $scope.sections = [];





   function TCget(turl, name) {
   // console.log("TCGet: " + name);
    $http({method: 'GET', url: turl}).
  success(function(data, status) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.sections[name] = data;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
};


function getUrl(section, amount) {
  return "http://localhost:3000/foursquare/" + $scope.city +  "/" + section + "/" + amount;
};


TCget(getUrl("restaurants"    ,6), "restaurants");
$timeout(TCget(getUrl("coffee",6), "coffee"     ), 300);
$timeout(TCget(getUrl("sights",6), "sights"     ), 600);
$timeout(TCget(getUrl("arts"  ,6), "arts"       ), 900);
$timeout(TCget(getUrl("shops" ,6), "shops"      ), 1200);
$timeout(TCget(getUrl("drinks" ,6), "drinks"    ), 1500);
$timeout(TCget(getUrl("outdoors",6), "outdoors" ), 1800);






    };