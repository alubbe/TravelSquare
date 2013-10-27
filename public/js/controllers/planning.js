
angular.module('mean.system').controller('PlanningController', ['$http','$scope', 'Global', function ($http,$scope, Global) {
    
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
        selected: true
      },{
        code: 1,
        title: 'COFFEE',
        id: 'coffee',
        titleBarColor: 'rgb(255,164,89)',
        selected: false
      },{
        code: 2,
        title: 'SIGHTS',
        id: 'sights',
        titleBarColor: 'rgb(254,116,88)',
        selected: false
      },{
        code: 3,
        title: 'ARTS',
        id: 'arts',
        titleBarColor: 'rgb(71,214,121)',
        selected: false
      },{
        code: 4,
        title: 'SHOPPING',
        id: 'shops',
        titleBarColor: 'rgb(84,155,247)',
        selected: false
      },{
        code: 5,
        title: 'NIGHTLIFE',
        id: 'drinks',
        titleBarColor: 'rgb(127,125,231)',
        selected: false
      },{
        code: 6,
        title: 'OUTDOORS',
        id: 'outdoors',
        titleBarColor: 'rgb(254,101,162)',
        selected: false
      }
    ];

    $scope.init = function() {
      var urlpre = "http://localhost:3000/foursquare/" + $scope.city + "/";
      // $scope.catsRestname = ['food',  'coffee', 'sights', 'shops', 'arts', 'outdoors',  'drinks'];
      // $scope.catsTitels = ['FOOD',  'COFFEE', 'SIGHTS', 'SHOPPING', 'ARTS & EVENTS', 'OUTDOORS', 'NIGHTLIFE'];
      $scope.allvenues = [];
      for (var i = 0; i < $scope.sections.length; i++) {
        caturl = urlpre + $scope.sections[i].id + '/8';
        console.log(caturl);
        $scope.TSxhrPush($http, $scope, caturl, $scope.sections[i].id, $scope.sections[i].title, "venues");
      }
    };

    $scope.TSxhrPush = function ($http, $scope, url, catsRestname, catsTitel, variablename){
            $http.jsonp(url).success(function (data) {
              $scope.sections[catsRestname].venues = data;
              console.log($scope.sections[catsRestname].venues);
            }).error(function (data, status, headers, config) {
                 console.log('Please try again soon.');
                 return;
            });
    };

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




