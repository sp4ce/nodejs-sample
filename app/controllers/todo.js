var model = require('./../models/todo.js');

exports.index = function(req, res, next) {
	req.app.get('db')
	res.render('index');
}

exports.show = function(req, res, next) {
	res.render('show', { note: 'coucou' });
};
