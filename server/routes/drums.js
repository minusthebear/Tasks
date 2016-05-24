var express = require('express');
var connection = require('../mySQLConnection');
var router = express.Router();
var Q = require('q');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

function setParams(x){
	return {
		artist: x.artist,
		song: x.song,
		rating: x.rating,
		id: x.id
	};
}

function addSpaces(data) {
	if(arguments.length < 1) Throw('No name given!');
	var newSpaces = data.replace(/\_+/g, ' ');
	return newSpaces;
};

function getDrumsData() {
	var dfd = Q.defer();
	Q.nfcall(connection.query('SELECT DISTINCT artist FROM drums ORDER BY artist', function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			 return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function addDrumsData(d) {
	var dfd = Q.defer();
	var p = setParams(d);
	Q.nfcall(connection.query("INSERT INTO drums(artist, song, rating) VALUES ('" + p.artist + "', '" + p.song + "', '" + p.rating + "')", function(err, rows, fields){
		if(!err){
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}


function updateDrumsData(d) {
	var dfd = Q.defer();
	var p = setParams(d);
	Q.nfcall(connection.query("UPDATE drums SET artist = '" + p.artist + "', song = '" + p.song + "', rating = '" + p.rating + "' WHERE id = " + p.id, function(err, rows, fields){
		if(!err){
			dfd.resolve(rows);
		}else{
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function getAllSongsByArtist(x) {
	var dfd = Q.defer();
	Q.nfcall(connection.query("SELECT artist, song, rating, id FROM drums WHERE artist='" + x + "' ORDER BY song", function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function getAllSongsByID(x) {
	var dfd = Q.defer();
	Q.nfcall(connection.query("SELECT artist, song, rating, id FROM drums WHERE id='" + x + "'", function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function getSongSearch(x){
	var dfd = Q.defer();	
	Q.nfcall(connection.query("SELECT artist,song FROM drums WHERE song LIKE '%" + x + "%'", function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;	
}
function getArtistSearch(x){
	var dfd = Q.defer();	
	Q.nfcall(connection.query("SELECT artist,song FROM drums WHERE artist LIKE '%" + x + "%'", function(err, rows, fields) {
		if(!err) {
			//Try JSON.parse if that doesn't work.	
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;	
}


function getAllInfo(req, res){
    var drumFunc = getDrumsData();
    var data;
    drumFunc.then(function(row) {
		data = JSON.stringify(row);
	}).catch(function(err){
		console.log("Error: " + err);
	}).done(function(){
		console.log(data);
		res.send(data);			
	});
}
/* GET all books and POST new books */
router.route('/')
    .get(function(req, res) {
    	getAllInfo(req, res);
    })
  	.post(function(req, res){
		var drumFunc = addDrumsData(req.body);
		drumFunc.then(function(row){
			console.log(row);
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			getAllInfo(req, res);
		});
	});

    //.post(function(req, res) {

        //var data = getBookData();
        //var nextID = getNextAvailableID(data);

        //var newBook = {
            //book_id: nextID,
            //title: req.body.title,
            //author: req.body.author,
            //year_published: req.body.year_published
        //};

        //data.push(newBook);

        //saveBookData(data);

////        res.set('Content-Type', 'application/json');
        //res.status(201).send(newBook);
    //});


router.route('/search/:id')
	.get(function(req, res) {
		var songName = addSpaces(req.params.id);
		
		var drumFunc = getSongSearch(songName);
		var compiledData;
		var JSONified;
		drumFunc.then(function(row){
			compiledData = row.filter(function(item){
				console.log(item);
				return item;
			});
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			JSONified = JSON.stringify(compiledData);
			console.log(JSONified);
			res.send(JSONified);			
		});
	});

router.route('/artist/:id')

    .get(function(req, res) {
    	console.log("Running through part 1");
        console.log(req.params);
        
        var artistName = addSpaces(req.params.id);
 
        var drumFunc = getAllSongsByArtist(artistName);
        var compiledData;
        var JSONified;
        drumFunc.then(function(row) {
			compiledData = row.filter(function(item){
				console.log(item);
				return item;
			});
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			JSONified = JSON.stringify(compiledData);
			res.send(JSONified);			
		});
    })
    .put(function(req, res) {
        console.log(req.body);
        console.log("This is going through artist put")
        var compFunc = updateDrumsData(req.body);
        var compiledData;
        var JSONified;

        compFunc.then(function(row) {
			console.log(row);
			compiledData = row;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			res.send(compiledData);			
		});
    });
       //.delete(function(req, res) {

        //var data = getBookData();

        //var pos = data.map(function(e) {
            //return e.book_id;
        //}).indexOf(parseInt(req.params.id, 10));

        //if (pos > -1) {
            //data.splice(pos, 1);
        //} else {
            //res.sendStatus(404);
        //}

        //saveBookData(data);
        //res.sendStatus(204);

    //})


router.route('/id/:id')

    .get(function(req, res) {
		console.log("Running through part 1");
        console.log(req.params);
        
        var artistName = addSpaces(req.params.id);
 
        var drumFunc = getAllSongsByID(artistName);
        var compiledData;
        var JSONified;
        drumFunc.then(function(row) {
			compiledData = row.filter(function(item){
				console.log(item);
				return item;
			});
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			JSONified = JSON.stringify(compiledData);
			res.send(JSONified);			
		});
    })
    .put(function(req, res) {
        console.log(req.body);
        var drumFunc = updateDrumsData(req.body);
        var compiledData;
        console.log("Testing 1")

        drumFunc.then(function(row) {
        	console.log("Testing 2")
			console.log(row);
			compiledData = row;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			console.log("Testing 3")
			res.send(compiledData);			
		});
    });

module.exports = router;
