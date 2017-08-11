const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var Client = require('mariasql')

app.set('view engine', 'pug')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var c  = new Client({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	db: process.env.DB
});

var toiminnot = []
toiminnot.push({toiminto: 'Tee yksittäinen varaus', id: '1'})
toiminnot.push({toiminto: 'Varaa vakioaika', id: '2'})
toiminnot.push({toiminto: 'Muokkaa varauksia', id: '3'})
toiminnot.push({toiminto: 'Varausten yhteenveto', id: '4'})
toiminnot.push({toiminto: 'Salasanan vaihto', id: '5'})
toiminnot.push({toiminto: 'Kirjaudu ulos', id: '6'})

var sauna = {id: 1, resurssinnimi: 'Sauna', kayttoaikalkaa: '16:00', kayttoaikapaattyy: '23:00', varausyksikko: 60, hinta: 2.10 };
var pyykkitupa = {id: 2, resurssinnimi: 'Pyykkitupa', kayttoaikalkaa: '06:00', kayttoaikapaattyy: '23:00', varausyksikko: 60, hinta: 1.85 };
var resurssit = [sauna, pyykkitupa]

var kellonajat = ['15:00', '16:00', '17:00', '18:00']

app.get('/', function (req, res) {
 	//res.render('valikko', {teksti: 'Tervetuloa', toiminnot})
 	console.log('Haetaan rivit');
 	//var resurssit = getAll();
 	
 	//c.query('SELECT * FROM Resurssi', function(err, rows) {
	//if (err)
	//	throw err
	//res.render('resurssit', {resurssit : rows});
	//})
	res.render('resurssit', {resurssit : resurssit});
	console.log('allResurssit kutsuttu')
})

function getAll() {
	var rivit;
	console.log("[getAll] kutsuttu")
	
	return rivit;
}

app.post('/testi', function (req, res) {
 	console.log(req.body.sisalto)
})

app.get('/yksittaisvaraus', function (req, res) {
	res.render('valikko', { teksti: 'Ysittäisvaraus: valitse resurssi', toiminnot: resurssit })
})

app.get('/resurssit', function (req, res) {
	res.render('valikko', { teksti: 'Resurssit', toiminnot: resurssit })
})

app.get('/kellonajat', function (req, res) {
	res.render('valikko', { teksti: 'Kellonajat', toiminnot: kellonajat})
})

app.listen(3000, function () {	
	console.log('Kuunnellaan porttia 3000')
})