const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.set('view engine', 'pug')

// var toiminnot = ['Tee yksittäinen varaus', 'Varaa vakiokaika', 'Muokkaa varauksia', 
//				 'Varausten yhteenveto', 'Salasanan vaihto', 'Kirjaudu ulos']

var toiminnot = []

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

toiminnot.push({toiminto: 'Tee yksittäinen varaus', id: '1'})
toiminnot.push({toiminto: 'Varaa vakioaika', id: '2'})
toiminnot.push({toiminto: 'Muokkaa varauksia', id: '3'})
toiminnot.push({toiminto: 'Varausten yhteenveto', id: '4'})
toiminnot.push({toiminto: 'Salasanan vaihto', id: '5'})
toiminnot.push({toiminto: 'Kirjaudu ulos', id: '6'})

var resurssit = ['Sauna', 'Pyykkitupa']

var kellonajat = ['15:00', '16:00', '17:00', '18:00']


app.get('/', function (req, res) {
 	res.render('valikko', {teksti: 'Tervetuloa', toiminnot})
})

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