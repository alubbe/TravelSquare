
angular.module('mean.system').controller('PlanningController', ['$http','$scope', 'Global', function ($http,$scope, Global) {
    $scope.global = Global;
    $scope.test = "PlanningController"
    
    $scope.city = "Barcelona";
     
        
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
 	
 	
 	$scope.venues['ART'] = testjson() ;
	
	$scope.venues['ART'].selected = false;
	$scope.venues['ART'].name = "ART"
 	console.log($scope.venues['ART'].name)
 	
 	 	$scope.sections = [$scope.venues['FOOD'], $scope.venues['ART']];
 
     
        // The colors and titles for the venue sections
        var titleBarColors = [
            'rgb(242,77,96)',
            'rgb(250,202,10)',
            'rgb(181,60,94)',
            'rgb(210,217,10)',
            'rgb(151,30,24)',
            'rgb(69,130,94)'
        ];
 

		urlpre = "http://localhost:3000/foursquare/" + $scope.city + "/";
		urlpost = "/8";
		
		$scope.catsRestname = ['food',  'coffee', 'sights', 'shops', 'arts', 'outdoors',  'drinks'];
		$scope.catsTitels = ['FOOD',  'COFFEE', 'SIGHTS', 'SHOPPING', 'ARTS & EVENTS', 'OUTDOORS', 'NIGHTLIFE',];
		$scope.allvenues = [];
		for (var catgory in catsRestname){
			url = urlpre + catgory + urlpost;
			TSxhrPush($http, $scope, url, catgory, "allvenues");
		}
		
		
		
       
       
       
       
        
}]);



 
    function TSxhrPush($http, $scope, url, catgory, variablename){
            $http.jsonp(url)               
       			  .success(function (data) {
              $scope[variablename].[catgory] = data;
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




