var Model = require('./../../lib/model.js');

var User = function(db) {
	Model.prototype.constructor.call(this, db, 'users');
};

User.prototype = Model.prototype;

module.exports = User;
