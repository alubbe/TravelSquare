
angular.module('mean.system').controller('PlanningController', ['$http','$scope', 'Global', function ($http, $scope, Global) {
    var _params = window.location.href.split("?")[1].split("#")[0];
    var params =  JSON.parse('{"' + _params.replace(/&/g, "\",\"").replace(/\=/g,"\":\"").replace(/%2C/g,",").replace(/\+/g," ") + '"}');
    $scope.global = Global;
    $scope.test = "PlanningController";
    
    $scope.city = params.location;
    $scope.days = params.days;
    $scope.sections = [
      {
        code: 0,
        title: 'FOOD',
        id: 'food',
        titleBarColor: 'rgb(255,225,89)',
        selected: true,
        venues: []
      },{
        code: 1,
        title: 'COFFEE',
        id: 'coffee',
        titleBarColor: 'rgb(255,164,89)',
        selected: false,
        venues: []
      },{
        code: 2,
        title: 'SIGHTS',
        id: 'sights',
        titleBarColor: 'rgb(254,116,88)',
        selected: false,
        venues: []
      },{
        code: 3,
        title: 'ARTS',
        id: 'arts',
        titleBarColor: 'rgb(71,214,121)',
        selected: false,
        venues: []
      },{
        code: 4,
        title: 'SHOPPING',
        id: 'shops',
        titleBarColor: 'rgb(84,155,247)',
        selected: false,
        venues: []
      },{
        code: 5,
        title: 'NIGHTLIFE',
        id: 'drinks',
        titleBarColor: 'rgb(127,125,231)',
        selected: false,
        venues: []
      },{
        code: 6,
        title: 'OUTDOORS',
        id: 'outdoors',
        titleBarColor: 'rgb(254,101,162)',
        selected: false,
        venues: []
      }
    ];

    var urlpre = "http://localhost:3000/foursquare/" + $scope.city + "/";
    $scope.init = function() {
      $scope.makeCall(0, urlpre + $scope.sections[0].id + '/8');
      // for (var i = 0; i < $scope.sections.length; i++) {
      //   caturl = urlpre + $scope.sections[i].id + '/8';
      //   console.log(caturl);
      //   var ii = i;
      //   $http({
      //       method: 'GET',
      //       url: caturl
      //   }).success(function(data, status) {
      //       for (var i = 0; i < data.length; i++) {
      //           $scope.sections[ii].venues.push(data[i].venue);
      //       }
      //       $scope.sections[ii].venues = $scope.sections[ii].venues.slice(0, 8);
      //       console.log($scope.sections[ii].venues);
      //   });
      // }
    };

    $scope.makeCall = function(sectionIndex, url) {
        $http({
            method: 'GET',
            url: url
        }).success(function(data, status) {
            for (var i = 0; i < data.length; i++) {
                $scope.sections[sectionIndex].venues.push(data[i].venue);
            }
            $scope.sections[sectionIndex].venues = $scope.sections[sectionIndex].venues.slice(0, 8);
            $scope['it'+sectionIndex] = data;
            console.log($scope.sections[sectionIndex].venues);
            if (sectionIndex < 1) {
                $scope.makeCall(sectionIndex + 1, (urlpre + $scope.sections[sectionIndex + 1].id + '/8'));
            }
        });
    };

    //   var urlpre = "http://localhost:3000/foursquare/" + $scope.city + "/";
    //   // $scope.catsRestname = ['food',  'coffee', 'sights', 'shops', 'arts', 'outdoors',  'drinks'];
    //   // $scope.catsTitels = ['FOOD',  'COFFEE', 'SIGHTS', 'SHOPPING', 'ARTS & EVENTS', 'OUTDOORS', 'NIGHTLIFE'];
    //   $scope.allvenues = [];
    //   for (var i = 0; i < $scope.sections.length-1; i++) {
    //     caturl = urlpre + $scope.sections[i].id + '/8';
    //     console.log(caturl);
        
    //            $http({
    //                 method: 'GET',
    //                 url: caturl
    //             }).success(function (data, status) {
    //                     $scope.sections[i].data = data;
    //                     $scope.it = data;
                        
    //           console.log(data);
    //                 });
                    
        
        
    //   }
    // };

  
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
        return 300;
    };

  }]);




