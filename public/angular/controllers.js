angular.module('app').controller('RegisterController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

	$scope.is_unique = function(value, callback) {
		$http.get('/users').success(function(users) {
			callback(users.indexOf(value) == -1);
		});
	}

	$scope.save = function() {
		$http.post('/user', {
			username: $scope.username,
			password: $scope.password
		}).success(function(user_id) {
			window.location.hash = "register/success";
			$rootScope.$broadcast('registerSuccessEvent', $scope.username);
		});
	}
}]);

angular.module('app').controller('LoginController', ['$scope', '$http', 'Auth', function($scope, $http, Auth) {

	Auth.isLoggedIn(function(result) {
		$scope.show_login = !result;
		$scope.show_logout = result;
		$scope.username = Auth.currentUser.username;
	});

	$scope.$on('registerSuccessEvent', function(event, username) {
		$scope.username = username;
		$scope.password_focus = true;
	});

	$scope.$on('userNotLoggedEvent', function(event) {
		$scope.show_login = true;
		$scope.show_logout = false;
	});

	$scope.login = function() {
		$http.post('/auth', {
			username: $scope.username,
			password: $scope.password
		}).success(function(data) {
			if (data.error) {
				$scope.wrong = true;
			} else {
				console.log('auth: ' + data.token);
				$scope.show_login = false;
				$scope.show_logout = true;
				Auth.logUser({ username: $scope.username, token: data.token});
				window.location.hash = 'todos';
			}
		});
	}

	$scope.logout = function() {
		$scope.show_login = true;
		$scope.show_logout = false;
		Auth.logUser({});
		window.location.hash = '/';
	}
}]);

angular.module('app').controller('TodoController', ['$scope', 'Auth', function($scope, Auth) {

	$scope.todos = [
		{text:'learn angular', done:true},
		{text:'build an angular app', done:false}];

	$scope.addTodo = function() {
		$scope.todos.push({text:$scope.todoText, done:false});
		$scope.todoText = '';
	};

	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.todos, function(todo) {
			count += todo.done ? 0 : 1;
		});
		return count;
	};

	$scope.archive = function() {
		var oldTodos = $scope.todos;
		$scope.todos = [];
		angular.forEach(oldTodos, function(todo) {
			if (!todo.done) $scope.todos.push(todo);
		});
	};
}]);
