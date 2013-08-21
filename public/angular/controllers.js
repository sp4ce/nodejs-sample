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

	// The addTodo functionality.
	$scope.addTodo = {
		priorities: ['Low', 'Medium', 'High'],
		submit: function() {
			var todo = {
				title: $scope.addTodo.title,
				description: $scope.addTodo.description,
				priority: $scope.addTodo.priority,
				deadline: $scope.addTodo.deadline,
				done:false
			};

			$http.post('/todo?access_token=' + Auth.getCurrentUser().token, {todo: todo}).success(function(id) {
				todo.id = id;
				$scope.todos.push(todo);
				$scope.sort.sort();
			});

			$scope.addTodo.title = '';
			$scope.addTodo.description = '';
			$scope.addTodo.priority = '';
			$scope.addTodo.deadline = '';
		}
	}

	// The sort functionality.
	$scope.sort = {
		attribute: 'priority',
		order: 'ascending',
		sort: function() {
			function getPriorityValue(todo) {
				return $scope.addTodo.priorities.indexOf(todo.priority);
			}
			function getDealineValue(todo) {
				// TODO
				return 0;
			}
			function getValue(todo) {
				switch ($scope.sort.attribute) {
					case 'priority':
						return getPriorityValue(todo);
					default:
						return 0;
				}
			}
			$scope.todos.sort(function(todo1, todo2) {
				var value1 = getValue(todo1);
				var value2 = getValue(todo2);
				return $scope.sort.order == 'ascending' ? value1 - value2 : value2 - value1;
			});
		},
		change: function() { $scope.sort.sort(); }
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
			$scope.sort.sort();
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
