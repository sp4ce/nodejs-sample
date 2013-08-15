function RegisterController($scope, $http) {

	var controller = this;
	$http.get('/users').success(function(users) {
		controller.users = users;
	});

	$scope.is_unique = function() {
		if (controller.users) {
			this.registerForm.$setValidity('username', false);
			return controller.users.indexOf($scope.username) == -1;
		}

		return false;
	}

	$scope.save = function() {
		$http.post('/user', {
			name: $scope.username,
			password: $scope.password }
		).success(function(user_id) {
			console.log(user_id);
		});
	}
}

function LoginController($scope) {
}
