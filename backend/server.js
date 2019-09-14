const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
    console.log('App running on port ' + PORT);
})

const mysql = require('mysql');

import config from './configs.js';
var connection = new mysql.createConnection(config);

connection.connect(function(err) {
    (err) ? console.log("ERROR:" + err + "++++++++++++++/////////"):console.log("connection*********");
});

require('./routes/html-routes')(app,connection);
