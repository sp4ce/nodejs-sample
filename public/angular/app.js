angular.module('app', ['ngRoute'], function($routeProvider){
	$routeProvider.when('/', {
    templateUrl: 'angular/templates/signup.html',
    controller: 'RegisterController'
  });

	$routeProvider.when('/register/success', {
    templateUrl: 'angular/templates/signup-success.html',
    controller: 'RegisterController'
  });

	$routeProvider.when('/todos', {
		templateUrl: 'angular/templates/todos.html',
		controller: 'TodoController'
	});
});
