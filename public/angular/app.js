angular.module('app', ['ngRoute', 'ngCookies'], function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'angular/templates/signup.html',
		controller: 'RegisterController',
		access: { isFree: true }
  });

	$routeProvider.when('/register/success', {
		templateUrl: 'angular/templates/signup-success.html',
		controller: 'RegisterController',
		access: { isFree: true }
  });

	$routeProvider.when('/todos', {
		templateUrl: 'angular/templates/todos.html',
		controller: 'TodoController',
		access: { isFree: false }
	});
}).run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		$rootScope.error = null;
		Auth.isLoggedIn(function(result) {
			if (result) {
				$location.path('/todos');
			} else if (!next.access || !next.access.isFree) {
				// The user is not logged and the access is not free, redirect to the register page
				$location.path('/');
				$rootScope.$broadcast('userNotLoggedEvent');
			}
		});
	});
}]);;
