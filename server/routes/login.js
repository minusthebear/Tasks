var express = require('express');
var connection = require('../mySQLConnection');
var app = express();
var Q = require('q');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User');
var request = require('request');
var LocalStrategy = require('../services/localStrategy');
var createSendToken = require('../services/jwt');
var facebookAuth = require('../services/facebookAuth');
var knex = require('../services/knex');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('Database opened');
});

//Comment out if table exists.
//knex.ifNoTable();

if(app.get('env') === 'development') {
    mongoose.connect('mongodb://localhost/tasks');
} else {
    console.log('production');
}   	

passport.serializeUser(function(user, done) {
	console.log("PASSPORT");
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id:id}).exec(function(err, user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

passport.use('local-login', LocalStrategy.login);
passport.use('local-register', LocalStrategy.register);

app.route('/')
	.post(passport.authenticate('local-login'), function(req, res){
		console.log("LOGIN");
		console.log(req.user);
		createSendToken(req.user, res);
	});

app.route('/register')
	.post(passport.authenticate('local-register'), function(req, res){
		//emailVerification.send(req.user.email);
		console.log("REGISTER");
		console.log(req.body.email);
		var nextCheck = knex.addUserToDatabase(req.user._id, req.user.name, req.body.email);
		nextCheck.then(function(x){
			knex.createUserTaskTable(req.user._id);
			createSendToken(req.user, res);	
			console.log("Token sent");			
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			console.log("Success!");
		});

	});

// app.route('/verifyEmail').get(emailVerification.handler);

app.route('/google')
	.post(function(req, res){
		var url = 'https://accounts.google.com/o/oauth2/token';
		var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

		var params = {
			client_id: req.body.clientId,
			redirect_uri: req.body.redirectUri,
			code: req.body.code,
			grant_type: 'authorization_code',
			//make sure in production the client_secret is hard coded
			client_secret: '7_smBU4M3Cr1B9y_BPj9PEwz'
		};

		console.log(req.body.code);
		request.post(url, {
			json: true,
			form: params
		}, function(err, response, token){
			console.log(token);
			var accessToken = token.access_token;
			var headers = {
				Authorization: 'Bearer ' + accessToken
			}

			request.get({
				url: apiUrl,
				headers: headers,
				json: true
			}, function(err, response, profile){
				console.log(profile);
				User.findOne({
					googleId: profile.sub
				}, function(err, foundUser){
					if(foundUser) return createSendToken(foundUser, res);

					var newUser = new User();
					newUser.googleId = profile.sub;
					newUser.displayName = profile.name;
					newUser.save(function(err){
						if (err) return next(err);
						createSendToken(newUser, res);
					});
				});
			});
		});
	});

app.route('/facebook').post(facebookAuth);


module.exports = app;
