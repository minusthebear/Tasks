var User = require('../models/User.js');
var LocalStrategy = require('passport-local').Strategy;

var strategyOptions = {
	name: 'name'
};



exports.login = new LocalStrategy({
	usernameField: 'name'
}, function(name, password, done){

	User.findOne({name: name}, function(err, user){
		if(err) { 
			console.log("ERROR!!!")
			return done(err); 
		}

		if(!user)
			return done(null, false, {
				message: "Wrong username/password"
			});

		user.comparePasswords(password, function(err, isMatch){
			if(err) return done(err);

			if(!isMatch) return done(null, false, {
				message: "Wrong email/password"
			});
			//createSendToken(user, res);
			return done(null, user);
			
		});
	});
});

exports.register = new LocalStrategy({
	usernameField: 'name'
}, function(name, password, done){
	User.findOne({name: name}, function(err, user){
		if(err) { 
			console.log("ERROR!!!")
			return done(err); 
		}

		if(user)
			return done(null, false, {
				message: "Name already exists."
			});

		var newUser = new User({
			name: name,
			password: password
		});

		console.log(newUser);

		newUser.save(function(err){
			done(null, newUser);
		});	
	});

});