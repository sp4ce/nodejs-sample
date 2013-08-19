'use strict';

angular.module('app').factory('Auth', function($cookieStore) {

	var currentUser = $cookieStore.get('user') || {};

	function logUser(user) {
		currentUser = user;
		$cookieStore.put('user', currentUser);
	};

	return {
		isLoggedIn: function() {
			if (currentUser.token) {
				return true;
			}
			return false;
		},
		logUser: logUser,
		currentUser: currentUser
	};
});
