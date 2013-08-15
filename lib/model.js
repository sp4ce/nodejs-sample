var Model = function(db, table) {
	this.db = db;
	this.table = table;
};

Model.prototype.findById = function(id, callback) {
	this.db.get('SELECT * FROM ' + this.table + ' WHERE rowid=' + id, callback);
}

Model.prototype.findAll = function(callback) {
	this.db.all('SELECT * FROM ' + this.table, callback);
}

module.exports = Model;
