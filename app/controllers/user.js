var User = require('./../models/user.js');

exports.list = function(req, res, next) {
	var user = new User(req.app.get('db'));
	user.findAll(function(err, rows) {
		res.json(rows);
	});
};
