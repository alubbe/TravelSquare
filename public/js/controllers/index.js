

angular.module('mean.system').controller('SplashCrtl', ['$http','$scope', 'Global', function ($http,$scope, Global) {
    $scope.global = Global;
    $scope.test = "SplashController"
        
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





angular.module('mean.system').controller('PlanningController', ['$http','$scope', 'Global', function ($http,$scope, Global) {
    $scope.global = Global;
    $scope.test = "PlanningController"
    
   // TSxhr($http, $scope, url, "allVenues");
    
 	
 //$scope.sections = [
 //'FOOD',
 //'COFFEE',
 //'SIGHTS',
 //'ARTSEVENTS',
 //'SHOPPING',
 //'NIGHTLIFE',
 //'OUTDOORS'];
 //$scope.sections = [];
//	food.name = "Food";
// 	selected = false;
 
 //$scope.sections.coffee.name = "COFFEE";
 //$scope.sections.food.selected = false;
	
	$scope.venues = [];
	$scope.venues['FOOD'] = testjson() ;
	
	$scope.venues['FOOD'].selected = false;
	$scope.venues['FOOD'].name = "FOOD"
 	console.log($scope.venues['FOOD'].name)
 	 	$scope.sections = [$scope.venues['FOOD']];
 
        $scope.openSection = function(index) {
            for (var i in $scope.sections) {
                if (i == index) {
                    // Display new section
                    $('#c'+i).css({
                        visibility: 'visible',
                        display: 'block'
                    }).animate({
                        height: $scope.getHeightOfSection(index)+'px',
                        padding: '5px'
                    }, 300);
                    continue;
                }
                // Hide all other sections
                $scope.sections[i].selected = false;
                $('#c'+i).animate({
                    height: 0,
                    padding: '0 5px'
                }, 300, function () {
                    $(this).css({
                        visibility: 'hidden',
                        display: 'none'
                    });
                });
            }
            $scope.sections[index].selected = true;
        };

        $scope.getHeightOfSection = function(index) {
            return $scope.sections[index].venues.length * 23;
        };


       
       
        
}]);



 
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
    
    
    
    
    
    function testjson() {
    return [
  {
    "reasons": {
      "count": 0,
      "items": []
    },
    "venue": {
      "id": "4adcf782f964a520016321e3",
      "name": "St. Oberholz",
      "contact": {
        "phone": "+493021461311",
        "formattedPhone": "+49 30 21461311",
        "twitter": "oberholz"
      },
      "location": {
        "address": "Rosenthaler Str. 72",
        "crossStreet": "Torstr.",
        "lat": 52.52962477028307,
        "lng": 13.401576783271219,
        "postalCode": "10119",
        "cc": "DE",
        "city": "Berlin",
        "country": "Germany"
      },
      "categories": [
        {
          "id": "4bf58dd8d48988d16d941735",
          "name": "Café",
          "pluralName": "Cafés",
          "shortName": "Café",
          "icon": {
            "prefix": "https://ss1.4sqi.net/img/categories_v2/food/cafe_",
            "suffix": ".png"
          },
          "primary": true
        }
      ],
      "verified": false,
      "restricted": true,
      "stats": {
        "checkinsCount": 17152,
        "usersCount": 5773,
        "tipCount": 204
      },
      "url": "http://www.sanktoberholz.de",
      "likes": {
        "count": 284,
        "groups": [
          {
            "type": "others",
            "count": 284,
            "items": []
          }
        ],
        "summary": "284 likes"
      },
      "rating": 9.58,
      "hours": {
        "isOpen": false
      },
      "specials": {
        "count": 1,
        "items": [
          {
            "id": "4c06d43986ba62b5df5388b3",
            "type": "mayor",
            "message": "Show that you're the Mayor and you've checked in on Foursquare and get a coffee flatrate (=free)!",
            "description": "Unlocked for the mayor",
            "icon": "mayor",
            "title": "Mayor Special",
            "provider": "foursquare",
            "redemption": "standard"
          }
        ]
      },
      "photos": {
        "count": 798,
        "groups": []
      },
      "hereNow": {
        "count": 0,
        "groups": []
      }
    },
    "tips": [
      {
        "id": "4d90a1f4d265236a57d43917",
        "createdAt": 1301324276,
        "text": "aka Hipster Central",
        "canonicalUrl": "https://foursquare.com/item/4d90a1f4d265236a57d43917",
        "todo": {
          "count": 13
        },
        "user": {
          "id": "626428",
          "firstName": "Donald",
          "lastName": "B.",
          "gender": "male",
          "photo": {
            "prefix": "https://irs0.4sqi.net/img/user/",
            "suffix": "/RO54VJVIANLJFADL.jpg"
          }
        }
      }
    ],
    "referralId": "e-0-4adcf782f964a520016321e3-0"
  },
  {
    "reasons": {
      "count": 0,
      "items": []
    },
    "venue": {
      "id": "4adcda7df964a520864721e3",
      "name": "Volkspark Friedrichshain",
      "contact": {},
      "location": {
        "address": "Landsberger Allee",
        "crossStreet": "Danziger Str.",
        "lat": 52.52661362996448,
        "lng": 13.433446884155273,
        "postalCode": "10249",
        "cc": "DE",
        "city": "Berlin",
        "country": "Germany"
      },
      "categories": [
        {
          "id": "4bf58dd8d48988d163941735",
          "name": "Park",
          "pluralName": "Parks",
          "shortName": "Park",
          "icon": {
            "prefix": "https://ss1.4sqi.net/img/categories_v2/parks_outdoors/park_",
            "suffix": ".png"
          },
          "primary": true
        }
      ],
      "verified": false,
      "restricted": true,
      "stats": {
        "checkinsCount": 7265,
        "usersCount": 2403,
        "tipCount": 56
      },
      "likes": {
        "count": 119,
        "groups": [
          {
            "type": "others",
            "count": 119,
            "items": []
          }
        ],
        "summary": "119 likes"
      },
      "rating": 9.54,
      "hours": {
        "status": "Open",
        "isOpen": true
      },
      "specials": {
        "count": 0,
        "items": []
      },
      "photos": {
        "count": 550,
        "groups": []
      },
      "hereNow": {
        "count": 0,
        "groups": []
      }
    },
    "tips": [
      {
        "id": "4d888f543acc6dcb23a8091c",
        "createdAt": 1300795220,
        "text": "My favorite park in Berlin. Lots of people here on a sunny day. Wild parties on hot summer nights.",
        "canonicalUrl": "https://foursquare.com/item/4d888f543acc6dcb23a8091c",
        "todo": {
          "count": 5
        },
        "user": {
          "id": "626428",
          "firstName": "Donald",
          "lastName": "B.",
          "gender": "male",
          "photo": {
            "prefix": "https://irs0.4sqi.net/img/user/",
            "suffix": "/RO54VJVIANLJFADL.jpg"
          }
        }
      }
    ],
    "referralId": "e-0-4adcda7df964a520864721e3-1"
  }
  ];
    
    }










