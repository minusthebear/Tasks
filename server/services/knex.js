var Q = require('q');
var connection = require('../mySQLConnection');
var express = require('express');

// Did a database named tasks get created?
var knex = require('knex')({
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'root',
		password: 'mysql',
		database: 'tasks'
	}
});

exports.createUserTable = function(x){
	console.log(x);
	return knex.schema.hasTable(x.id).then(function(exists) {
		if (!exists) {
			return knex.schema.createTable(x.id, function(t){
				t.increments();
				for (var y in x.val){
					t.string(x.val[y], 255);
					// console.log(x.val[y]);
				}
				t.timestamps();
			});
		} else {
			return console.log("Error!");
		}
	});		
};

exports.deleteTable = function(x){
	return knex.schema.dropTable(x);
};

exports.addRow = function(id, task){
	return knex(id).insert(task);
};

exports.logUserTask = function(id, task){
	return knex(id).insert({task: task});
};

exports.getAllTasks = function(id){
	return knex.column('task').select().from(id);
};

exports.getRow = function(task, id){
	console.log("TASK: " + task);
	console.log("ID: " + id);
	return knex(task).where('id', id);
};

exports.editRow = function(task, val, id){
	var len = Object.keys(val).length, obj = {};

	for (var v in val) {
		if (i === undefined){ 
			var i = 1; 
		} else { 
			i++; 
		}
		var v_str = v.replace(/\s/g, '_');
		obj[v_str] = val[v];

		if(i === len){
			return knex(task).where('id', '=', id).update(obj);
		}
	 }
}

exports.deleteRow = function(id, table){
	return knex(id).where('task', table).del();
};

exports.getTaskColumns = function(t){
	
	console.log("This is T");
	console.log(t);
	var col = [];
	return knex(t).columnInfo().then(function(info) {
		for (var x in info){
			console.log(x);
			col.push(x);
		}
		return col;
	});
};

exports.getUserTable = function(t){
	console.log("THIS IS T: " + t);
	return knex.select().table(t);
};

exports.getAllUserTables = function(t){
	console.log("2");
	console.log(t);
	// Keep this function for reference.
	// This function works, but takes too much time.
	// var dfd = Q.defer();
	// Q.nfcall(connection.query("SHOW TABLES LIKE '%" + t + "%'", function(err, rows, fields) {
	// 	if(!err) {
	// 		// Try JSON.parse if that doesn't work.	
	// 		dfd.resolve(rows);
	// 	} else {
	// 		return dfd.reject(err);
	// 	}
	// }));
	// return dfd.promise;
};

exports.addUserToDatabase = function(id, name, email){
	return knex('users').insert([{ id: id.toString(), name: name.toString(), email: email.toString() }]);
}

exports.ifNoTable = function(){
	return knex.schema.hasTable('users').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('users', function(t){
				t.string('id').primary();
				t.string('name', 100);
				t.string('email', 100);
			});
		} else {
			return false;
		}
	});
};


exports.createUserTaskTable = function(id){
	return knex.schema.hasTable(id.toString()).then(function(exists) {
		if (!exists) {
			return knex.schema.createTable(id.toString(), function(t){
				t.string('task', 100);
			});
		} else {
			return false;
		}
	});
};