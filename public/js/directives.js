angular.
    module('mean.tours').
    directive('titlebox', function() {
  		return {
      		restrict: 'E',
     		transclude: true,
		    link: function(scope, el, attrs) {
		    	window.setTimeout(function() {
			    	$('#h'+scope.section.code).css('background-color', scope.section.titleBarColor);
		    	}, 5);
		    },
		    template: '<div id="h{{section.code}}" class="title" ng-click="openSection($index)" ng-translude>{{section.title}}</div>',
      		replace: true
		};
	});