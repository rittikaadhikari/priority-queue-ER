const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

const mysql = require('mysql2');

// const config = {
// 	host: 'hackmitdb.mysql.database.azure.com',
// 	user: 'rittika2@hackmitdb',
// 	password: 'Hackathon2019',
//     database: 'mysampledb',
// };
const config = require('./configs')
const queries = require('./query_database')
var connection = new mysql.createConnection(config.config);
connection.connect(function (err) {
    if (err) { throw (err); } else {
        console.log("connection*********"); queries.createDatabase(connection);
    }
});

var connection; 

function startConnection() {
    console.error('CONNECTING');
    connection = mysql.createConnection(config.config);
    connection.connect(function(err) {
        if (err) {
            console.error('CONNECT FAILED', err.code);
            startConnection();
        }
        else
            console.error('CONNECTED');
    });
    connection.on('error', function(err) {
        if (err.fatal)
            startConnection();
    });
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});

//require('./routes/html-routes')(app,connection);}
app.get('/create', function (req, res) {
    var connection = new mysql.createConnection(config.config);
    connection.connect(function (err) {
        res.send(queries.createDatabase(connection));
    });
});

app.get('/get_all', function (req, res) {
    console.log('in /get_all')
    var connection = new mysql.createConnection(config.config);
    connection.connect(function (err) {
        // var promise = new Promise( function(resolve,reject) {resolve(queries.readData(connection));});
        // promise
        // .then(function(result) {console.log(result);}, function (failure) {console.log(failure);})
        queries.readData(connection).then(function(result) {res.send(result);});
        
    });

});

app.post('/insert_data', function (req, res) {
    var connection = new mysql.createConnection(config.config);
    connection.connect(function (err) {
        res.send(queries.insertData(connection));
    });

});

app.delete('/delete_row', function (req, res) {
    var connection = new mysql.createConnection(config.config);
    connection.connect(function (err) {
        res.send(queries.deleteData(connection));
    });
});


// function queryDatabase(conn){
//     conn.query('DROP TABLE IF EXISTS inventory;', function (err, results, fields) { 
//          if (err) throw err; 
//          console.log('Dropped inventory table if existed.');
//      })
//       conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);', 
//            function (err, results, fields) {
//                if (err) throw err;
//          console.log('Created inventory table.');
//      })
//     conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150], 
//            function (err, results, fields) {
//                if (err) throw err;
//          else console.log('Inserted ' + results.affectedRows + ' row(s).');
//         })
//     conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 154], 
//            function (err, results, fields) {
//                if (err) throw err;
//          console.log('Inserted ' + results.affectedRows + ' row(s).');
//         })
//     conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100], 
//      function (err, results, fields) {
//                if (err) throw err;
//          console.log('Inserted ' + results.affectedRows + ' row(s).');
//         })
//     conn.end(function (err) { 
//      if (err) throw err;
//      else  console.log('Done.') 
//      });
// };