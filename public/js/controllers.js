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
		
		$scope.sectiontitles = [
							{id :"restaurants", name : "FOOD"},
							{id : "coffee", name : "COFFEE"},
							{id : "arts", name : "ARTS"},
							{id : "shops", name : "SHOPPING"},
							{id : "drinks", name : "NIGHTLIFE"},
							{id : "outdoors", name : "OUTDOORS"},
							];	
		var $ = $window.jQuery;
		console.log($);

		// TODO
		console.log('TODO: Load the planning data...')

		// Called when loading the index.html
		$scope.setup = function() {
			console.log('Planning view loaded');
	    $scope.test = "Controller ok";
	    // $scope.city =  $scope.$location.search().location ;
	    // $scope.days =  $scope.$location.search().location ;   
	    //$scope.city = TSglobal_city;
	    
	    var urlparams, param_city = "Amsterdam", param_days = "2";
	    if($window.location.href.split("?")[1] != null) {
	    	urlparams = $window.location.href.split("?")[1].split("&");
	    	param_city =  urlparams[0].split("=")[1];
	    	param_days =  urlparams[1].split("=")[1];
	    }
      $scope.city = decodeURI(param_city);
      $scope.days = decodeURI(param_days);

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
			    console.log('TCget returned an error');
			    console.log(data);
			  });
			};

			function getUrl(section, amount) {
			  return "/foursquare/" + $scope.city +  "/" + section + "/" + amount;
			};

			TCget(getUrl("restaurants"    ,6), "restaurants");
			

			function loadOnDemand(sectiontitle){
				console.log("Gettting sectiontitle data for section: " + sectiontitle);
				console.log(sectiontitle);
				TCget(getUrl(sectiontitle,6), sectiontitle);
			};

			$timeout(function(){TCget(getUrl("coffee",6), "coffee"     )}, 300);

			TSglobal_likes = [];
			TSglobal_dislikes = [];
			TSglobal_visibles = [];
			TSglobal_city = "Barcelona";
			TSglobal_hotel = "JetPack Alternative";
			TSglobal_startdate = "01.12.2013";
			TSglobal_daysofstay = 5;
			  


			// JQueries of ng-created elements
			$timeout(function() {
				$( "#accordion" ).accordion({
		      		event: "click hoverintent",
		      		header: "h3" ,
		     		// activate: function( event, ui ) {console.log(ui.newHeader[0].id);}
		    	});	

				$(".accorideonIndiHeader").click(function(event){loadOnDemand((event.currentTarget.id).substring(10))});

			}, 10);    
			

		  $( "input[type=submit]" )
		      .button({
		      icons: {
		        primary: "ui-icon-locked"
		      }
		    })
		      .click(function( event ) {
		        event.preventDefault();
		      }); 

		  $( ".venueTrash" ).click(function() {
		  	$(this).parents(".square").hide('fade');
		    TSglobal_dislikes.push("idkommtnoch");
		    console.log("dislike id 123");
		    /*retrieve id, toggle on/off*/
		  });

		  $( ".venueHeart" ).click(function() {
		  	$(this).removeClass( "imgoff" );
		    TSglobal_likes.push("idkommtnoch");
		    console.log("like id 123");
		    /*retrieve id, toggle on/off*/
		  });

		  $("#calculatetrip").click(function(){
		      prefix = "prefix";
		      llikes = "";
		      ldislikes = "";
		      lothers = "";
		      var nexturl = prefix + "&city=" + TSglobal_city + "&hotel=" + TSglobal_hotel + "&startdate=" + TSglobal_startdate + "&daysofstay=" + TSglobal_daysofstay + "&likes=" + TSglobal_likes + "&dislikes=" + TSglobal_dislikes + "&visibles=" + TSglobal_visibles;    
		       $( "#debugnexturl" ).html(nexturl); 
		       $( "#debugnexturl" ).dialog( "open" );

      });

	    $( "#debugnexturl" ).dialog({
	      autoOpen: false,
	      show: {
	        effect: "blind",
	        duration: 1000
	      },
	      hide: {
	        effect: "explode",
	        duration: 1000
	      }
	    });

		}

		// Called by the form in the planning.html
		$scope.submit = function(planningModel) {
			// Update the URL
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
