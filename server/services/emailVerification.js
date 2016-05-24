var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var config = require('./config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../models/User');

var model = {
	verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
	title: 'Tasks',
	subtitle: 'Thanks for joining!',
	body: 'Please verify by clicking on the link below.'
}

exports.send = function(email){
	var payload = {
		sub: email
	};

	var token = jwt.encode(payload, config.EMAIL_SECRET);	

	console.log(getHtml(token));

	var transporter = nodemailer.createTransport(smtpTransport({
		host: 'smtpout.______.com',
		secure: true,
		auth: {
			user: 'matt.hamann1982@gmail.com',
			pass: config.SMTP_PASS
		} // go to host and look up email settings
	}));

	var mailOptions = {
		from: 'Accounts <matt.hamann1982@gmail.com>',
		to: 'email',
		subject: 'Tasks and Chores',
		html: getHtml(token)
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err) return res.status(500, err);
		console.log('email sent ', info.response);
	});
};

exports.handler = function(req, res){
	var token = req.query.token;

	var payload = jwt.decode(token, config.EMAIL_SECRET);

	var email = payload.sub;

	if(!email) return handleError(res);

	User.findOne({ email: email}, function(err, foundUser) {
		if(err) return res.status(500);

		if(!foundUser) return handleError(res);

		if(!user.active)
			user.active = true;

		user.save(function(err){
			if(err) return res.status(500);

			return res.redirect('http://localhost:3000/#/')
		});
	});
};


function getHtml(token){
	var path = './server/views/email_verification.html';
	//in production, this should be an ASYNC method
	var html = fs.readFileSync(path, encoding = 'utf8');

	var template = _.template(html);

	model.verifyUrl += token;

	return template(model);
}

function handleError(res){
	return res.status(401).send({
		message: "Authentication failed. Unable to verify email."
	});
}


_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};