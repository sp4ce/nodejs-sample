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
		$scope.username = Auth.getCurrentUser().username;
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

angular.module('app').controller('TodoController', ['$scope', '$http', 'Auth', function($scope, $http, Auth) {

	// The list of priorities
	$scope.addTodoPriority = {
		list: ['Low', 'Medium', 'High'],
		change : function() {
			$scope.addTodoPriority.cssClass = 'selected';
		}
	}

	// Get the todos from the server.
	$http({
		method: 'GET',
		url: '/todos',
		params: { access_token: Auth.getCurrentUser().token }
	}).success(function(result) {
		if (result.error) {
			$scope.todos = []
		} else {
			$scope.todos = result.todos;
		}
	}).error(function() {
		$scope.todos = []
	});

	$scope.deleteTodo = function(todo) {
		console.log(todo);
		$scope.todos.splice($scope.todos.indexOf(todo), 1);
		$http({
			method: 'DELETE',
			url: '/todo/' + todo.id + '?access_token=' + Auth.getCurrentUser().token,
		});
	}

	$scope.addTodo = function() {
		var todo = {
			title: $scope.addTodoTitle,
			description: $scope.addTodoDescription,
			priority: $scope.addTodoPriority.value,
			deadline: $scope.addTodoDeadline,
			done:false
		};

		$http.post('/todo?access_token=' + Auth.getCurrentUser().token, {todo: todo}).success(function(id) {
			todo.id = id;
			$scope.todos.push(todo);
		});
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
