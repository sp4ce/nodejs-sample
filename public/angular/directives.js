angular.module('app').directive('usernameunique', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			// view -> model
			elm.on('blur', function() {
				ctrl.$setValidity('checking', false);
				scope.$apply(function() {
					scope.is_unique(elm.val(), function(unique) {
						ctrl.$setValidity('checking', true);
						ctrl.$setValidity('used', unique);
					});
				});
			});
		}
	};
})
.directive('focus', function () {
	return function (scope, element, attrs) {
		attrs.$observe('focus', function (newValue) {
			newValue === 'true' && element[0].focus();
		});
	}
})