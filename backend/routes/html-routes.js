var Request = require('tedious').Request;
const path = require('path')

module.exports = function(app, connection) {
    app.get('/', function(req,res) {
        res.send("hello from simple-react-project")
    });
};

