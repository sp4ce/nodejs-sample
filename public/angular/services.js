angular.module('app').factory('Auth', function($cookieStore) {

	var currentUser = $cookieStore.get('user');

	$cookieStore.remove('user');

	return {
		isLoggedIn: function() {
			if (currentUser) {
				return true;
			}
			return false;
		},
		currentUser: currentUser
	};
});
