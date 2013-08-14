var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite');

module.exports = {
	db: db,
	init: function() {
		db.serialize(function() {
			// Test if the schema exist.
			db.get(
				"SELECT name FROM sqlite_master WHERE type='table' AND name='users';",
				function(err, row) {
					if (!row) {
						console.log('Initializing db schema');
						db.run("CREATE TABLE users (name TEXT, password TEXT)");
						db.run("CREATE TABLE todos (title TEXT, priority INTEGER, date TEXT, status INTEGER)");
					}
				}
			);

			// var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
			// for (var i = 0; i < 10; i++) {
				// stmt.run("Ipsum " + i);
			// }
			// stmt.finalize();
		});
	}
}