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

exports.update = function(req, res, next) {
	// Get user associated with token.
	get_user_id(req, res, function(user) {
		// Get arguments.
		var todo_id = req.params.todo_id;
		var new_todo = req.body.todo;

		// Get model.
		var Todo = req.app.get('models').Todo

		// Get the object in DB and save only new values.
		Todo.find({ where: { id: todo_id } }).success(function(todo) {
			// Test that this todo belong to the user.
			if (todo.userId != user.id) {
				// Send a 404.
				res.send(404);
			} else {
				// Update only existing attribute.
				for (var name in todo) { todo[name] = new_todo[name] ? new_todo[name] : todo[name]; }

				// save in DB.
				todo.save().success(function() {
					// Send success response.
					res.json({ error: false });
				}).error(function(error) {
					// Send error response.
					res.json({ error: true, message: err});
				});
			}
		}).error(function(err) {
			// Send error response.
			res.json({ error: true, message: err});
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
