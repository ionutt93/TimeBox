'use strict'
// Modules ===================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// Configuration =============================
// Config files
var db = require('./config/db');
var port = process.env.PORT || 3000; // set our port
// Models
var User = require('./models/user');

// Connect to database
if ('development' == app.get('env'))
	mongoose.connect(db.dev_url, function (err) {
		if (err) 
			throw err;
		console.log("Succesfuly connected to development database!");
	});
else if ('production' == app.get('env'))
	mongoose.connect(db.prod_url, function (err) {
		if (err) 
			throw err;
		console.log("Succesfuly connected to production database!");
	});
else if ('test' == app.get('env'))
	mongoose.connect(db.test_url, function (err) {
		if (err) 
			throw err;
		console.log("Succesfuly connected to test database!");
	});



// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ====================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
