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
		if (next.access && !next.access.isFree && !Auth.isLoggedIn()) {
			$location.path('/');
			$rootScope.$broadcast('userNotLoggedEvent');
		}
	});
}]);;
