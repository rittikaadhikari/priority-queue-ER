var Request = require('tedious').Request;
const path = require('path')
const queries = require('../query_database')

module.exports = function (app, connection) {
    app.get('/create', function (req, res) {
        res.send(queries.createDatabase(connection));
    })

    app.get('/get_all', function (req, res) { 
        console.log('in /get_all')
        res.send(queries.readData(connection));
    })

    app.post('/insert_data', function (req, res) {
        res.send(queries.insertData(connection));
    })

    app.delete('/delete_row', function (req, res) {
        res.send(queries.deleteData(connection));
    }) 
}