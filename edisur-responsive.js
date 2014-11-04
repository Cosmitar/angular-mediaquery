(function(){
	var app = angular.module( 'EdisurWeb.Responsive', [] );
	app.service( "ResponsiveManager", [ function(){
		var listeners = [];
		var resolveObject = function(){
			this.w = 0;//event.currentTarget.innerWidth, 
			this.h = 0;//event.currentTarget.innerHeight,
			this.bounds = {
				minW: 0,
				maxW: 0,
				minH: 0,
				maxH: 0
			};
			this.changed = false;
			this.in = false;
			this.isBellowMinWidth = function(){ return this.bounds.minW > this.w; };
			this.isAboveMinWidth = function(){ return !this.isBellowMinWidth(); };
			this.isBellowMinHeight = function(){ return this.bounds.minH > this.h; };
			this.isAboveMinHeight = function(){ return !isBellowMinHeight(); };
			this.isAboveMaxWidth = function(){ return this.bounds.maxW < this.w; };
			this.isBellowMaxWidth = function(){ return !this.isAboveMaxWidth(); };
			this.isAboveMaxHeight = function(){ return this.bounds.maxH < this.h; };
			this.isBellowMaxHeight = function(){ return !this.isAboveMaxHeight(); };
			this.isInner = function(){
				return this.isAboveMinWidth() && isAboveMinHeight() &&
					this.isBellowMaxWidth() && this.isBellowMaxHeight();
			};
			this.isOuter = function(){
				return this.isBellowMinWidth() || this.isBellowMinHeight() ||
					this.isAboveMaxWidth() || this.isAboveMaxHeight();
			};
		};
		var Q = function(){
			var _onTrue, _onFalse, _onNotify;
			this.callback = function( whenTrue, whenFalse, whenNotify ){
				_onTrue = whenTrue || new Function;
				_onFalse = whenFalse || new Function;
				_onNotify = whenNotify || new Function;
				//returns manager in order to allow queries concatenation.
				//ResponsiveManager.query().callback().query().callback();
				return this.manager;
			};
			this.resolveTrue = function( args ){
				_onTrue( args );
			};
			this.resolveFalse = function( args ){
				_onFalse( args );
			};
			this.notify = function( args ){
				_onNotify( args );
			};
			this.getResolveObject = function(){
				return new resolveObject;
			};
		};
		return {
			fireResize: function( event ){
				var el, resolveObject, subscriber;
				for( el in listeners ){
					subscriber = listeners[ el ];

					resolveObject = subscriber.deferred.getResolveObject();
					resolveObject.w = event.currentTarget.innerWidth;
					resolveObject.h = event.currentTarget.innerHeight;
					
					maxW = event.currentTarget.innerWidth <= subscriber.conditions.maxWidth;
					resolveObject.bounds.maxW = subscriber.conditions.maxWidth;
					minW = event.currentTarget.innerWidth >= subscriber.conditions.minWidth;
					resolveObject.bounds.minW = subscriber.conditions.minWidth;
					maxH = event.currentTarget.innerHeight <= subscriber.conditions.maxHeight;
					resolveObject.bounds.maxH = subscriber.conditions.maxHeight;
					minH = event.currentTarget.innerHeight >= subscriber.conditions.minHeight;
					resolveObject.bounds.minH = subscriber.conditions.minHeight;
					if( maxW && minW && maxH && minH ){
						resolveObject.changed = !subscriber.lastValue;
						subscriber.lastValue = true;
						resolveObject.in = true;
					}else{
						resolveObject.changed = subscriber.lastValue || subscriber.lastValue === undefined;
						subscriber.lastValue = false;
						resolveObject.in = false;
					}

					if( resolveObject.changed ){
						if( resolveObject.in ){
							subscriber.deferred.resolveTrue( resolveObject );
						}else{
							subscriber.deferred.resolveFalse( resolveObject );
						}
					}
					//notify
					subscriber.deferred.notify( resolveObject );
				}
			},
			query: function( config ){
				var deferred = new Q,
					conditions = {
						minWidth: 0,
						maxWidth: Number.MAX_VALUE,
						minHeight: 0,
						maxHeight: Number.MAX_VALUE
					};
					angular.extend( conditions, config );
				deferred.manager = this;
				listeners.push( { conditions: conditions, deferred: deferred, lastValue: undefined } );
				return deferred;
			}
		}
	}]);
	app.directive( 'responsiveListener',[ '$window', 'ResponsiveManager', function( $window, ResponsiveManager ){
		return {
			restrict: 'A',
			link: function( scope, elem, attrs ){
				$window.onresize = function( event ){
					ResponsiveManager.fireResize( event );
				}
				ResponsiveManager.fireResize( { currentTarget: $window } );
			}
		}
	}]);
})();