var travelSquareControllers = angular.module('travelSquareControllers', []);

travelSquareControllers.controller('IndexCtrl', [
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

travelSquareControllers.controller('PlanningCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    '$routeParams',
    '$window',
    '$timeout',
    function ($scope, $rootScope, $http, $location, $routeParams, $window, $timeout) {


        console.log('Planning controller loaded');
        $scope.test = 'planning OK';

        $scope.sectiontitles = [{
            id: "restaurants",
            name: "FOOD"
        }, {
            id: "coffee",
            name: "COFFEE"
        }, {
            id: "arts",
            name: "ARTS"
        }, {
            id: "shops",
            name: "SHOPPING"
        }, {
            id: "drinks",
            name: "NIGHTLIFE"
        }, {
            id: "outdoors",
            name: "OUTDOORS"
        }, ];
        var $ = $window.jQuery;
        console.log($);

        $scope.requiredvenues = [];

        $scope.addVenue = function(venue){
          //  $scope.requiredvenues.push(venue);
           // console.log("addVenue");
            console.log(venue.required);
         //   console.log(event.target);
           

            if (venue.required === true){
                //deactivate heart
                  venue.required = false;
                  var i = $scope.requiredvenues.indexOf(venue);
                  if(i != -1) {
                    $scope.requiredvenues.splice(i, 1);
                    console.log($scope.requiredvenues);

                    } 
                }
                 else {
                // activate heart
                venue.required = true;
                $scope.requiredvenues.push(venue);
                console.log($scope.requiredvenues);
               
                };
            };



        // TODO
        console.log('TODO: Load the planning data...')

        // Called when loading the index.html
        $scope.setup = function () {
            console.log('Planning view loaded');
            $scope.test = "Controller ok";


            var urlparams, param_city = "Amsterdam",
                param_days = "2";
            if ($window.location.href.split("?")[1] != null) {
                urlparams = $window.location.href.split("?")[1].split("&");
                param_city = urlparams[0].split("=")[1];
                param_days = urlparams[1].split("=")[1];
            }
            $scope.city = decodeURI(param_city);
            $scope.days = decodeURI(param_days);

            $scope.sections = [];

            function TCget(turl, name) {
                 // Do not load loaded section again
                   if (!Array.isArray($scope.sections[name] )){                      

                    // console.log("TCGet: " + name);
                    $http({
                        method: 'GET',
                        url: turl
                    }).
                    success(function (data, status) {
                        // this callback will be called asynchronously
                        // when the response is available
                       //console.log(data);
                      
                       for (var i=0;i<data.length;i++)
                        {
                            data[i].section = name;
                            data[i].required = false;
                            }
                    
                        $scope.sections[name] = data;
                        //console.log($scope.sections[name] );
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('TCget returned an error');
                        
                    });

                }
            };

            function getUrl(section, amount) {
                return "/foursquare/" + $scope.city + "/" + section + "/" + amount;
            };

           


            function loadOnDemand(sectiontitle) {
                console.log("Gettting sectiontitle data for section: " + sectiontitle);
                console.log(sectiontitle);
                TCget(getUrl(sectiontitle, 8), sectiontitle);
            };


             TCget(getUrl("restaurants", 8), "restaurants");
            $timeout(function () {
                TCget(getUrl("coffee", 8), "coffee")
            }, 1300); // preloding more sections as well

            $timeout(function () {
                TCget(getUrl("arts", 8), "arts")
            }, 1800); // preloding more sections as well

            $timeout(function () {
                TCget(getUrl("shops", 8), "shops")
            }, 2200); // preloding more sections as well

            $timeout(function () {
                TCget(getUrl("drinks", 8), "drinks")
            }, 2800); // preloding more sections as well
            $timeout(function () {
                TCget(getUrl("outdoors", 8), "outdoors")
            }, 3500); // preloding more sections as well

            // JQueries of ng-created elements
            $timeout(function () {
                $("#accordion").accordion({
                    event: "click hoverintent",
                    header: "h3",
                    // activate: function( event, ui ) {console.log(ui.newHeader[0].id);}
                });

                $(".accorideonIndiHeader").click(function (event) {
                    loadOnDemand((event.currentTarget.id).substring(10))
                });

            }, 10);


            $("input[type=submit]")
                .button({
                    icons: {
                        primary: "ui-icon-locked"
                    }
                })
                .click(function (event) {
                    event.preventDefault();
                });

        }

        // Called by the form in the planning.html
        $scope.submit = function (planningModel) {
        
        $rootScope.selectedvenues = {
        city : $scope.city,
        numberOfCalendarDays : $scope.days,
        };

        var requiredvenues = $scope.requiredvenues;    
        for (var i=0;i<requiredvenues.length;i++)
            {

                var section = requiredvenues[i].section;
                if (!Array.isArray($rootScope.selectedvenues[section]))
                    { 
                        //create new sections
                        $rootScope.selectedvenues[section] = [];
                    }
                $rootScope.selectedvenues[section].push(requiredvenues[i]);
            }

            console.log($rootScope.selectedvenues);
            $location.path('/tours');
            



        };
    }
]);

travelSquareControllers.controller('ToursCtrl', [
	'$scope',
	'$rootScope',
	'$http',
	'$routeParams',
	function ($scope, $rootScope, $http, $routeParams) {
		console.log('Tours controller loaded');
		$scope.test = 'tours OK';

		// TODO
		console.log('TODO: Load the tours data...')

		// Called when loading the tours.html
		$scope.setup = function() {
			console.log('Tours view loaded');
		}
	}
]);
