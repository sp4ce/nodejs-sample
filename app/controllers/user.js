var crypto = require('crypto');

/**
 * List all the users.
 */
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

/**
 * Create one user.
 */
exports.create = function(req, res, next) {
	// Get arguments.
	var name = req.body.name;
	var password = req.body.password;

	// Encrypt password
	password = crypto.createHash('md5').update(password).digest('hex');

	// Get model.
	User = req.app.get('models').User;

	// Create a new user.
	var user = User.build({ name: name, password: password });

	// Save in DB.
	user.save().error(function(err) {
    console.log(err);
		res.json(-1);
  }).success(function() {
    res.json(user.id);
  });
}
