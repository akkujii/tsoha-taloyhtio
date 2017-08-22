const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//var Client = require('mariasql')
var dbc = require('./dbcontroller')
const env = require('dotenv').config()
var async = require('async')

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
 	res.render('index')
})

app.get('/resurssit', function(req,res) {
	dbc.getResurssit(function(err, rows) {
		if (err)
			console.log('Tietokantaoperaatio epäonnistui')
		res.render('resurssit', {resurssit: rows})
	})
})

app.post('/luoresurssi', function (req, res) {
	console.log(req.body)
})

app.get('/luoresurssi', function (req, res) {
	res.render('luoresurssi')
})

app.get('/muokkaaresurssia', function (req, res) {
	res.render('muokkaaresurssia')
})

app.post('/muokkaaresurssia', function (req, res) {
	console.log(req.body)
})

app.get('/aikarakolistaus', function (req, res) {
	console.log('/aikarakolistaus pyydetty')
	dbc.getAllAikaraot(function(err, rows) {
		res.render('aikarakolistaus', {aikaraot: rows})
	})
})

app.get('/resurssi', function (req, res) {
	console.log('[GET /resurssi} pyydetty: ' + req.query.id)
	dbc.getPaivamaarat(req.query.id, function(err, rows) {
		console.log('/resurssi sai rivit joista ensimmainen on: ' + rows[1])
		res.render('paivamaarat', {aikaraot: rows})
	})
}) 

app.get('/kellonajat', function (req, res) {
	console.log(req.query.id)
	res.render('valikko', { teksti: 'Kellonajat', toiminnot: kellonajat})
})

app.post('/testi', function (req, res) {
 	console.log(req.body.sisalto)
})

app.get('/yksittaisvaraus', function (req, res) {
	res.render('valikko', { teksti: 'Ysittäisvaraus: valitse resurssi', toiminnot: resurssit })
})

app.listen(app.get('port'), function () {	
	console.log('Kuunnellaan porttia', app.get('port'))
})