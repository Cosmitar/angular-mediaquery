(function(){
	var app = angular.module( 'angularResponsive' );
	app.directive( 'responsiveListener',[ '$window', 'ResponsiveManager', function( $window, ResponsiveManager ){
		return {
			restrict: 'A',
			link: function( scope, elem, attrs ){
				$window.onresize = function( event ){
					ResponsiveManager.fireResize( event );
					scope.$apply();
				}
				ResponsiveManager.fireResize( { currentTarget: $window } );
			}
		}
	}]);
})();