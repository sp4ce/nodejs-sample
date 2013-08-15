exports.list = function(req, res, next) {
	// Get model.
	User = req.app.get('models').User;

	// Get all the user.
	User.all().error(function(err) {
		console.log('ERROR' + err);
		res.json([]);
	}).success(function(users) {
		res.json(users.map(function(user) { return user.name }));
	});
};
