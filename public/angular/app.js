angular.module('app', [])
	.directive('usernameunique', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				// view -> model
				elm.on('blur', function() {
					scope.$apply(function() {
						scope.is_unique(elm.val(), function(unique) {
							ctrl.$setValidity('used', unique);
						});
					});
				});
			}
		};
	});