function RegisterController($scope, $http) {

	var controller = this;
	$http({ method: 'GET', url: '/users'})
	.success(function(users) {
		controller.users = users;
	});

	$scope.is_unique = function() {
		if (controller.users) {
			this.registerForm.$setValidity('username', false);
			return controller.users.indexOf($scope.username) == -1;
		}

		return false;
	}
}

function LoginController($scope) {
}
