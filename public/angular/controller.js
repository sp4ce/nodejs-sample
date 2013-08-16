function RegisterController($scope, $rootScope, $http) {

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
			window.location.hash = "register/success";
			$rootScope.$broadcast('registerSuccessEvent', $scope.username);
		});
	}
}

function LoginController($scope) {

	$scope.$on('registerSuccessEvent', function(event, username) {
		$scope.username = username;
		$scope.password_focus = true;
	});
}
