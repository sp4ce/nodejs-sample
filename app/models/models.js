var Sequelize = require("sequelize");

// Database connection.
var sequelize = module.exports = new Sequelize('db', null, null, {
	// sqlite! now!
	dialect: 'sqlite',

	// the storage engine for sqlite
	// - default ':memory:'
	storage: 'db.sqlite'
})

// User model.
var User = module.exports.User = sequelize.define('user', {
	username:	Sequelize.STRING,
	password:	Sequelize.STRING,
	token:		Sequelize.STRING
});

// Todo model.
var Todo = module.exports.Todo = sequelize.define('todo', {
	title:				Sequelize.STRING,
	description:	Sequelize.TEXT,
	priority:			Sequelize.INTEGER,
	deadline:			Sequelize.DATE,
	done:					Sequelize.INTEGER
});

// Schema information.
User.hasMany(Todo);

// Schema creation.
User.sync({force: true});
Todo.sync({force: true});