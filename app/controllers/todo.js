exports.need_auth = true;

exports.list = function(req, res, next) {
	// Get user associated with token.
	get_user_id(req, res, function(user) {
		// Get the list of todos.
		var Todo = req.app.get('models').Todo
		Todo.all({where : { userId: user.id }}).error(function(err) {
			console.log('ERROR' + err);
			res.json({error: true, message: err});
		}).success(function(todos) {
			res.json({error: false, todos: todos});
		});
	});
};

exports.create = function(req, res, next) {
	// Get user associated with token.
	get_user_id(req, res, function(user) {
		// Get arguments.
		var todo = req.body.todo;
		todo.userId = user.id;

		// Get model.
		var Todo = req.app.get('models').Todo

		// Save the model.
		todo = Todo.build(todo);
		todo.save().success(function() {
			// Respond to new id.
			res.json(todo.id);
		});
	});
}

exports.delete = function(req, res, next) {
	// Get arguments.
	var id = req.params.todo_id;

	// Get model.
	var Todo = req.app.get('models').Todo

	// Save the model.
	Todo.destroy({id: id});

	// Response.
	res.send();
}

function get_user_id(req, res, callback) {
	var token = req.query.access_token;
	var User = req.app.get('models').User;
	User.find({ where: { token: token } }).success(callback).error(function(err) {
		console.log('ERROR' + err);
		res.json({error: true, message: err});
	});
}
