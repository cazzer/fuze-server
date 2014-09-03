/*
Modules
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	routeUtils = require('./server/routes/_utils');

/*
The App
 */
var app = module.exports = express();
/*
Set App variables
 */
app.set('port', process.env.PORT || 3000);
app.set('environment', process.env.NODE_ENV || 'development');
app.set('client', 'client/production');
app.set('version', 1);

/*
Set App configuration
 */
app.use(express.static(__dirname + '/' + app.get(('client'))));
app.use(bodyParser.json());

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());


/*
Load the client side
 */
app.get('/', function(req, res) {
	res.send(app.get('client') + '/index.html');
});

app.get('/auth/soundcloud',
	passport.authenticate('soundcloud'),
	function(req, res){
		// The request will be redirected to SoundCloud for authentication, so this
		// function will not be called.
	});

// GET /auth/soundcloud/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/soundcloud/callback',
	passport.authenticate('soundcloud', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

/*
Load routes...anyone have a better way of doing this in Express?
 */
require('./server/routes')(app);

/*
Auth Routes
 */
app.post( base + 'login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/oops'
}));

/*
Start it up
 */
app.listen(app.get('port'), function() {
	console.log('Doin\' something fun over at :' + app.get('port'));
});

/*
Makes this module public
 */
module.exports = app;