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
app.listen(PORT, () => {
    console.log('App running on port ' + PORT);

    var connection = new mysql.createConnection(config.config);
    console.log(config.config);
    connection.connect(function(err) {
        if (err){throw(err);} else {console.log("connection*********"); queryDatabase(connection);}
    });

    require('./routes/html-routes')(app,connection);


})

function queryDatabase(conn){
    conn.query('DROP TABLE IF EXISTS inventory;', function (err, results, fields) { 
         if (err) throw err; 
         console.log('Dropped inventory table if existed.');
     })
      conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);', 
           function (err, results, fields) {
               if (err) throw err;
         console.log('Created inventory table.');
     })
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150], 
           function (err, results, fields) {
               if (err) throw err;
         else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 154], 
           function (err, results, fields) {
               if (err) throw err;
         console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100], 
     function (err, results, fields) {
               if (err) throw err;
         console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    conn.end(function (err) { 
     if (err) throw err;
     else  console.log('Done.') 
     });
};

