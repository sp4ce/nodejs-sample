exports.need_auth = true;

exports.list = function(req, res, next) {
	// Get parameters.
	var user_id = req.query.user_id;
	if (!user_id) {
		res.json({error: true, message: 'Require user_id in the query string'});
		return;
	}

	// Get model.
	var Todo = req.app.get('models').Todo

	// Get the list of todos.
	Todo.all({where : { userId: user_id }}).error(function(err) {
		console.log('ERROR' + err);
		res.json({error: true, message: err});
	}).success(function(todos) {
		res.json({error: false, todos: todos});
	});
};
