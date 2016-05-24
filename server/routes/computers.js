var express = require('express');
var connection = require('../mySQLConnection');
var router = express.Router();
var Q = require('q');

function setParams(x){
	return {
		topic: x.topic,
		type: x.type,
		started: x.date_started,
		id: x.id,
		comments: x.comments
	};
}

function getComputerData() {
	var dfd = Q.defer();
	Q.nfcall(connection.query('SELECT * FROM computers', function(err, rows, fields) {
		if(!err) {
			dfd.resolve(rows);
		} else {
			 return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function updateComputerData(c) {
	var dfd = Q.defer();
	var p = setParams(c);
	Q.nfcall(connection.query("UPDATE computers SET type = '" + p.type + "', date_started = '" + p.started + "', comments = '" + p.comments + "' WHERE id = " + p.id, function(err, rows, fields) {
		if(!err) {
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function addComputerData(c) {
	var dfd = Q.defer();
	var p = setParams(c);
	Q.nfcall(connection.query("INSERT INTO computers(topic, type, date_started, comments) VALUES ('" + p.topic + "', '" + p.type + "', '" + p.started + "', '" + p.comments + "')", function(err, rows, fields){
		if(!err){
			dfd.resolve(rows);
		} else {
			return dfd.reject(err);
		}
	}));
	return dfd.promise;
}

function getAllInfo(req, res) {
	var compFunc = getComputerData();
	var data;
	compFunc.then(function(row) {
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
    .post(function(req, res) {
		var compFunc = addComputerData(req.body);
		compFunc.then(function(row){
			console.log(row);
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			getAllInfo(req, res);
		});
    });


/* GET, PUT and DELETE individual books */
router.route('/:id')

    .get(function(req, res) {

        var compFunc = getComputerData();
        var compiledData;
        var JSONified;
        compFunc.then(function(row) {
			compiledData = row.filter(function(item){
				return item.id == req.params.id 
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
        var compFunc = updateComputerData(req.body);
        var compiledData;

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


module.exports = router;
