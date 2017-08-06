var Client = require('mariasql');

var c = new Client({
	host: 'localhost',
	user: 'root',
	password: 'r0TT3rd@m',
	db: 'taloyhtio'
});


var query = c.query("SELECT * FROM Resurssi");
query.on('result', function(res) {
  // `res` is a streams2+ Readable object stream
  res.on('data', function(row) {
  	console.log("Taloyhtiö: " + row.taloyhtio);
    console.dir(row.taloyhtio);
    console.log("Resurssin nimi: " + row.resurssinnimi);
  }).on('end', function() {
    console.log('Result set finished');
  });
}).on('end', function() {
  console.log('No more result sets!');
});

c.end();
