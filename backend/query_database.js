/**
 * This function initializes the database with mock data.
 */
function createDatabase(conn) {
    conn.query('DROP TABLE IF EXISTS cases;', function (err, results, fields) {
        if (err) throw err;
        console.log('Dropped cases table if existed.');
    })

    conn.query('CREATE TABLE cases (patient_uuid SERIAL PRIMARY KEY, name VARCHAR(50), health_insurance_no LONG, severity INTEGER, condition_ VARCHAR(2000), eta DATE);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Create cases table.');
        })

    conn.query('INSERT INTO cases (name, health_insurance_no, severity, condition_, eta) VALUES (?, ?, ?, ?, ?);',
        ['Navam Awasthi', 8675832126, 2, 'I have had constipation for two weeks.', '2019-09-15 15:22:44'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' rows(s).');
        })

    conn.query('INSERT INTO cases (name, health_insurance_no, severity, condition_, eta) VALUES (?, ?, ?, ?, ?);',
        ['Rittika Adhikari', 9892567421, 4, 'I vomited three times today, and there was a bit of blood this time.', '2019-09-15 12:21:42'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' rows(s).');
        })

    conn.query('INSERT INTO cases (name, health_insurance_no, severity, condition_, eta) VALUES (?, ?, ?, ?, ?);',
        ['Kavya Tumkur', 3257786212, 5, 'My infant has a high fever of 104, and is coughing up phlegm.', '2019-09-15 10:19:33'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' rows(s).');
        })

    conn.query('INSERT INTO cases (name, health_insurance_no, severity, condition_, eta) VALUES (?, ?, ?, ?, ?);',
        ['Anisha Purohit', 7271928376, 1, 'My sinuses feel inflamed, and I cannot stop coughing.', '2019-09-15 9:03:22'],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' rows(s).');
        })

    conn.end(function (err) {
        if (err) throw err;
        else console.log('Done.');
    });
}

/**
 * This function inserts a new patient entry.
 */
function insertData(conn) {
    conn.query('INSERT INTO cases (name, health_insurance_no, severity, condition_, eta) VALUES (?, ?, ?, ?, ?);',
        [req.name, req.health_insurance_no, req.severity, req.condition_, req.eta],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' rows(s).');
        })

    conn.end(function (err) {
        if (err) throw err;
        else console.log('Done.');
    });
};

/**
 * This function returns the data in the database as a string.
 */
function readData(conn, res) {
    return new Promise(function(resolve, reject) {
    console.log('in readData')
    conn.query('SELECT * FROM cases',
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
            resolve( JSON.stringify(results));
        })

    conn.end(function (err) {
        if (err) throw err;
        else console.log('Done.')
    });});
};

/**
 * This function deletes a row from the database.
 */
function deleteData(conn) {
    conn.query('DELETE FROM inventory WHERE patient_uuid = ?', [req.patient_uuid],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Deleted ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) {
            if (err) throw err;
            else console.log('Done.')
        });
};

module.exports.createDatabase = createDatabase;
module.exports.deleteData = deleteData;
module.exports.readData = readData;
module.exports.insertData = insertData;