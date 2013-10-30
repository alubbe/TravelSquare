angular.module('travelSquare.directives', []).directive('modalbox', function() {
	return {
		restrict: 'E',
		transclude: true,
		link: function(scope, el, attrs) {
			window.setTimeout(function() {
				// Save content height in corresponding box
				scope.modalBox.contentHeight = $('#' + el[0].id + '-c').height();
				// Hide the content area
				if ($('#' + el[0].id + '-c').css('visibility') === 'hidden') {
					$('#' + el[0].id + '-c').css({
						visibility: 'hidden',
						dispaly: 'none',
						height: '0'
					});
				}
			}, 1);
		},
		templateUrl: 'views/directives/modalbox.html',
		replace: true
	};
});
