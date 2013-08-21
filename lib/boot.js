var express = require('express');
var fs = require('fs');
var passport = require('passport');

module.exports = function(parent, options) {
	var verbose = options.verbose;
	verbose && console.log('Initializing framework');

	// Load models
	parent.set('models', require('./../app/models/models.js'));

	// Load controllers.
	fs.readdirSync(__dirname + '/../app/controllers').forEach(function(name) {
		verbose && console.log('- controller %s:', name);
		
		// Require the controller.
		var obj = require('./../app/controllers/' + name);
		var name = obj.name || name.split('.')[0];
		var prefix = obj.prefix || '';
		var app = express();
		var method;
		var path;

		// allow specifying the view engine
		if (obj.engine) app.set('view engine', obj.engine);
		app.set('views', __dirname + '/../app/views/' + name);

		// // before middleware support
		// if (obj.before) {
			// path = '/' + name + '/:' + name + '_id';
			// app.all(path, obj.before);
			// verbose && console.log('		 ALL %s -> before', path);
			// path = '/' + name + '/:' + name + '_id/*';
			// app.all(path, obj.before);
			// verbose && console.log('		 ALL %s -> before', path);
		// }

		// generate routes based
		// on the exported methods
		for (var key in obj) {
			// "reserved" exports
			if (~['name', 'prefix', 'engine', 'before', 'need_auth'].indexOf(key)) continue;
			// route exports
			switch (key) {
				case 'show':
					method = 'get';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:' + name + '_id/edit';
					break;
				case 'update':
					method = 'put';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;
				case 'delete':
					method = 'delete';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'auth':
					method = 'post'
					path = '/auth';
					break;
				case 'token':
					method = 'get'
					path = '/token';
					break;
				case 'index':
					method = 'get';
					path = '/';
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}

			path = prefix + path;
			if (obj.need_auth) {
				app[method](path, passport.authenticate('bearer', { session: false }), obj[key]);
			} else {
				app[method](path, obj[key]);
			}
			verbose && console.log('	* %s %s -> %s', method.toUpperCase(), path, key);
		}

		// mount the app
		parent.use(app);
	});
};