var Request = require('tedious').Request;
const path = require('path')

module.exports = function (app, connection) {
    app.get('/create', function (req, res) {
        res.send(createDatabase());
    })

    app.get('/get_all', function (req, res) { 
        res.send(readData());
    })

    app.post('/insert_data', function (req, res) {
        res.send(insertData());
    })

    app.delete('/delete_row', function (req, res) {
        res.send(deleteData());
    }) 
}