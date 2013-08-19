angular.module('app').factory('Auth', function($cookieStore) {

	var currentUser = $cookieStore.get('user');

	$cookieStore.remove('user');

	return {
		isLoggedIn: function() {
			if (currentUser) {
				return false;
			}
			return true;
		},
		currentUser: currentUser
	};
});
