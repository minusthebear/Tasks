var express = require('express');
var connection = require('../mySQLConnection');
var router = express.Router();
var Q = require('q');

function setParams(x){
	return {
		title: x.title,
		type: x.author,
		rating: x.rating,
		year: x.year,
		category: x.category
	};
}

function addSpaces(data) {
	if(arguments.length < 1) Throw('No name given!');
	var newSpaces = data.replace(/\_+/g, ' ');
	return newSpaces;
}

function getBooksData() {
	var dfd = Q.defer();
	Q.nfcall(connection.query('SELECT * FROM books ORDER BY author', function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			 return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

/* GET all books and POST new books */
router.route('/')
    .get(function(req, res) {
        var bookFunc = getBooksData();
        var data;
        bookFunc.then(function(row) {
			data = JSON.stringify(row);
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			console.log(data);
			res.send(data);			
		});

    });

module.exports = router;
