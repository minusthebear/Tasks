var express = require('express');
var connection = require('../mySQLConnection');
var router = express.Router();
var Q = require('q');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var knex = require('../services/knex');

router.route('/addTable')
	.post(function(req, res){
		console.log(req.body);
		var table = {}, t = req.body.table;
		TID = req.body.id + "$" + t.task_name;
		table.id = TID.replace(/\s/g, "_");

		var values = [];
		
		for (var key in t){
			if (t.hasOwnProperty(key)){
				if (key.indexOf("value") > -1) {
					var k = key.substring(5),
						val = t[key].replace(/\s/g, "_");
					values.push(k + "$" + val);
				}
			}
			table.val = values;	
		}
	    var knx1 = knex.createUserTable(table),
	    	knx2 = knex.logUserTask(req.body.id, req.body.table.task_name);

	    knx1.then(function(c) {
			return knx2;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			console.log("Mission accomplished!");
			res.status(200).end();		
		});
	});

router.route('/checkID')
	.post(function(req, res){
		console.log(req.body.id);
		var knx = knex.createUserTaskTable(req.body.id);
		res.status(200).end();	
	});

router.route('/deleteTable')
	.delete(function(req, res){
		var table = req.body.table,
			array = table.split("$"),
			id = array[0], task = array[1],
			knx1 = knex.deleteTable(table),
			knx2 = knex.deleteRow(id, table);
		console.log(id);
		console.log(task);

		// knx.then(function(r){
		// 	console.log(r);
		// 	return r;
		// }).catch(function(err){
		// 	console.log("Error: " + err);
		// }).done(function(){
		// 	console.log(message);
		// 	res.status(200).end();
		// });	
	});	

router.route('/addRow')
	.post(function(req, res){
		var id = req.body.id,
			row = req.body.row;
		var array = [];
		for (var r in row){
			array[r] = row[r];
		}
		var knx = knex.addRow(id, row);
		

		executeKNX(knx, res, "Row added!");
	});

router.route('/editRow')
	.post(function(req, res){
		console.log(req.body);
		var task = req.body.task,
			val = req.body.val,
			id = req.body.id,
			knx = knex.editRow(task, val, id);
		
		executeKNX(knx, res, "Row updated!");
	});	

router.route('/deleteRow/:id/:task/:table')
	.post(function(req, res){
		var p = req.params;
		var table = p.table,
			task = p.task,
			id = p.id,
			knx1 = knex.deleteRow(id, table);
			knx2 = knex.deleteTable(task);

			knx1.then(function(c) {
				return knx2;
			}).catch(function(err){
				console.log("Error: " + err);
			}).done(function(){
				console.log("Mission accomplished!");
				res.status(200).end();		
			});
	});

router.route('/getRow/:task/:id')
	.get(function(req, res){
		var id = req.params.id,
			task = req.params.task,
			knx = knex.getRow(task, id);
//		var task;
		knx.then(function(t){
			return t;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(r){
			successful(res, r);
		});
	});

router.route('/getTable/:task')
	.get(function(req, res){
		var knx = knex.getUserTable(req.params.task);
		var task;
		knx.then(function(t){
			console.log("T");
			console.log(t);
			task = t;
			console.log("TASK!");
			console.log(task);
			return task[0];
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			successful(res, task);
		});
	});

router.route('/getColumns/:task')
	.get(function(req, res){
		console.log("GET COLUMNS");
		console.log(req.params.task);
		var knx = knex.getTaskColumns(req.params.task);
		var task = [];
		knx.then(function(t){
			console.log("Did this get read?");
			t.forEach(function(x){
				console.log(x);
				if(x != 'id' && x != 'created_at' && x != 'updated_at'){
					task.push(x);
				}
			});
			return task;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			res.status(200).send({task: task});		
		});
	});

router.route('/getAllTables/:id')
	.get(function(req, res){
		var knx = knex.getAllTasks(req.params.id);
		var array = [];
		knx.then(function(r){
			r.forEach(function(c){
				array.push(c.task);
			});
			return array;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			res.send(array);		
		});
	});

function successful(res, task){
	if (!(task.length > 0)) {
		res.status(200).send({message: "empty"});
		return;
	}
	for (var key in task){
		if (task.hasOwnProperty(key)){
			for (var v in task[key]) {
				if((v == 'created_at') || (v == 'updated_at')){
					delete task[key][v];	
				}
			}	
		}
	}
	res.status(200).send({task: task, message: "val"});	
}

function executeKNX(knx, res, message){
	return knx.then(function(r){
			console.log("R!!!");
			console.log(r);
			return r;
		}).catch(function(err){
			console.log("Error: " + err);
		}).done(function(){
			console.log(message);
			res.status(200).send({message: "Completed"});
		});	
}

module.exports = router;
