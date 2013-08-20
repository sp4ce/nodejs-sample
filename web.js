var express = require("express");
var app = express();

// map .renderFile to ".html" files
app.engine('html', require('ejs').renderFile);

// make ".html" the default
app.set('view engine', 'html');

// set views for error and 404 pages
app.set('views', __dirname + '/public');

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg) {
	// reference `req.session` via the `this.req` reference
	var sess = this.req.session;
	// simply add the msg to an array for later
	sess.messages = sess.messages || [];
	sess.messages.push(msg);
	return this;
};

// log
if (!module.parent) app.use(express.logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// session support
app.use(express.cookieParser('HFGDGJHA23HDHD'));
app.use(express.session());

// parse request bodies (req.body)
app.use(express.bodyParser());

// support _method (PUT in forms etc)
app.use(express.methodOverride());

// expose the "messages" local variable when views are rendered
app.use(function(req, res, next){
	var msgs = req.session.messages || [];

	// expose "messages" local variable
	res.locals.messages = msgs;

	// expose "hasMessages"
	res.locals.hasMessages = !! msgs.length;

	next();
	// empty or "flush" the messages so they
	// don't build up
	req.session.messages = [];
});

// Password configuration (authentication).
// Use the BearerStrategy within Passport.
// Strategies in Passport require a `validate` function, which accept
// Credentials (in this case, a token), and invoke a callback with a user
// object.
var passport = require('passport');
app.use(passport.initialize());
var BearerStrategy = require('passport-http-bearer').Strategy;
passport.use(new BearerStrategy({
	},
	function(token, done) {
		// asynchronous validation, for effect...
		process.nextTick(function () {

			// Find the user by token. If there is no user with the given token, set
			// the user to `false` to indicate failure. Otherwise, return the
			// authenticated `user`. Note that in a production-ready application, one
			// would want to validate the token for authenticity.
			app.get('models').User.find({ where: { token: token } }).success(function(user) {
				if (!user) {
					return done(null, false);
				} else {
					console.log(user.username);
					return done(null, {id: user.id, username: user.username, token: user.token}, { scope: 'all' });
				}
			}).error(function(err) {
				console.log('ERROR: ' + err);
				return done(err);
			});
		});
	}
));

// load controllers and models
require('./lib/boot')(app, { verbose: !module.parent });

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function(err, req, res, next){
	// treat as 404
	if (~err.message.indexOf('not found')) return next();

	// log it
	console.error(err.stack);

	// error page
	res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
	res.status(404).render('404', { url: req.originalUrl });
});

if (!module.parent) {
	var port = process.env.PORT || 5000;
	app.listen(port);
	console.log('listening on port ' + port);
}
