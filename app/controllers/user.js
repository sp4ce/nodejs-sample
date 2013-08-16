var crypto = require('crypto');

/**
 * List all the users.
 */
exports.list = function(req, res, next) {
	// Get model.
	var User = req.app.get('models').User;

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
	var User = req.app.get('models').User;

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

exports.auth = function(req, res, next) {
	// Get arguments.
	var username = req.body.username;
	var password = req.body.password;
	
	if (!username || !password) {
		res.json({error: true, message: 'missing argument' });
		return;
	}

	// Encrypt password.
	password = crypto.createHash('md5').update(password).digest('hex');

	// Get model.
	User = req.app.get('models').User;

	// Get user from DB.
	User.find({ where: { name: username } }).success(function(user) {
		// Test if user exit and password is correct.
		if (user && user.password && user.password === password) {
			// Generate a token.
			crypto.randomBytes(48, function(ex, buf) {
				// Save the token in the DB
				user.token = buf.toString('hex');
				user.save(['token']).success(function() {
					// Return the token to the client.
					res.json({error: false, token: user.token});
				}).error(function(err) {
					res.json({ error: true, message: err });
				});
			});
		} else {
			res.json({ error: true, message: 'Wrong user or password' });
		}
	}).error(function(err) {
		res.json({ error: true, message: err });
	});
}
