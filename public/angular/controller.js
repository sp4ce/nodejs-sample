function RegisterController($scope, $http) {

	$scope.is_unique = function(value, callback) {
		$http.get('/users').success(function(users) {
			callback(users.indexOf(value) == -1);
		});
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
