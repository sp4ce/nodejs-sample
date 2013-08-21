'use strict';

angular.module('app').factory('Auth', function($cookieStore, $http) {

	var currentUser = $cookieStore.get('user') || {};

	function logUser(user) {
		currentUser = user;
		$cookieStore.put('user', currentUser);
	};

	return {
		isLoggedIn: function(callback) {
			if (!currentUser.token || !currentUser.username) {
				return callback(false);
			}

			$http({
				method: 'GET',
				url: '/token',
				params: {
					username: currentUser.username,
					token: currentUser.token
				}
			}).success(function(result) {
				result = eval(result);
				if (!result) {
					logUser({});
				}
				callback(result);
			}).error(function() {
				logUser({});
				callback(false);
			});
		},
		logUser: logUser,
		getCurrentUser: function() { return currentUser; }
	};
});
