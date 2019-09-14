function queryDatabase(){
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

function updateData(){
    conn.query('UPDATE inventory SET quantity = ? WHERE name = ?', [200, 'banana'], 
         function (err, results, fields) {
             if (err) throw err;
             else console.log('Updated ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) { 
             if (err) throw err;
             else  console.log('Done.') 
     });
};

function readData(){
    conn.query('SELECT * FROM inventory', 
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
   conn.end(
       function (err) { 
            if (err) throw err;
            else  console.log('Closing connection.') 
    });
};

function deleteData(){
    conn.query('DELETE FROM inventory WHERE name = ?', ['orange'], 
         function (err, results, fields) {
             if (err) throw err;
             else console.log('Deleted ' + results.affectedRows + ' row(s).');
        })
    conn.end(
        function (err) { 
             if (err) throw err;
             else  console.log('Done.') 
     });
};
