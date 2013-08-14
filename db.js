var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
	db.run("CREATE TABLE lorem (info TEXT)");

	var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
	for (var i = 0; i < 10; i++) {
		stmt.run("Ipsum " + i);
	}
	stmt.finalize();
});

app.get('/', function(request, response) {
	console.log('coucou');
	db.serialize(function() {
	  var msg = '';
		db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      //console.log(row.id + ": " + row.info);
			msg += row.id + ": " + row.info + '<br />';
		}, function(err, num) {
			response.send(msg);
		});
	});
});