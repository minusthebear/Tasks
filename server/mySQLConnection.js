var mysql = require('mysql');
//var _ = require('underscore');
//var fs = require('fs');

var dbTable = null;


var mySQLConnection;
var db_config = {
    host: process.env.MYSQL_HOST ? process.env.MYSQL_HOST : 'localhost',
    port: process.env.MYSQL_PORT ? process.env.MYSQL_PORT : 3306,
    database: process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : 'tasks',
    user: process.env.MYSQL_USER ? process.env.MYSQL_USER : 'root',
    password: process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : 'mysql'
};

console.log(db_config);

/**
 * http://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
 */
function handleDisconnect() {
    mySQLConnection = mysql.createConnection(db_config); // Recreate the mySQLConnection, since
    // the old one cannot be reused.

    // DJH 3/19/2015 - not sure how risky this is, but did this to support
    // https://github.com/felixge/node-mysql
    // connection.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });

    mySQLConnection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    mySQLConnection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('Error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log('Success connecting to mysql')
        }                                    // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    mySQLConnection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();


// question for BC, is there a better way to do this
mySQLConnection.sendResponse = function (res, err, rows, fields) {
    if (err) {
        console.error(err);
        res.statusCode = 500;
        res.send({
            result: 'error',
            err: err.code
        });
    } else {
        res.send({
            result: 'success',
            err: '',
            //fields: fields,
            json: rows,
            length: rows.length
        });
    }
}

// question for BC, is there a better way to do this
mySQLConnection.sendResponseFirst = function (res, err, rows, fields) {
    if (err) {
        console.error(err);
        res.statusCode = 500;
        res.send({
            result: 'error',
            err: err.code
        });
    } else {
        res.send({
            result: 'success',
            err: '',
            //fields: fields,
            json: rows[0],
            length: rows.length
        });
    }
}


mySQLConnection.sendUpdateResponse = function (res, method, err, result) {
    if (err != null) {
        console.log(method + ' error ' + err);
        res.statusCode = 500;
    } else {
        console.log(method + ' success');
    }
    res.send({
        result: result,
        err: err
    });
}
module.exports = mySQLConnection;
