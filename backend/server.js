const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
    console.log('App running on port ' + PORT);
})

var Connection = require('tedious').Connection;

import config from './configs.js';
var connection = new Connection(config);

connection.connect(function(err) {
    (err) ? console.log("ERROR:" + err + "++++++++++++++/////////"):console.log("connection*********");
});

require('./routes/html-routes')(app,connection);
