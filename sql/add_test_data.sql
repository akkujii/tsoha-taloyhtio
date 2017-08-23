INSERT INTO Resurssi
	(kayttoaikaalkaa, kayttoaikapaattyy, varausyksikko, resurssinnimi, hinta) VALUES
	('150000', '230000', '10000', 'Sauna', '3.84'),
	('60000', '220000', '10000', 'Pyykkitupa', '1.50')
;

# luodaan saunalle aikarakoja
CALL luoaikaraotpaivalle(1, '2017-08-05');
CALL luoaikaraotpaivalle(1, '2017-08-06');
CALL luoaikaraotpaivalle(1, '2017-08-07');

# luodaan pyykkituvalle aikarakoja
CALL luoaikaraotpaivalle(2, '2017-08-05');
CALL luoaikaraotpaivalle(2, '2017-08-06');
CALL luoaikaraotpaivalle(2, '2017-08-07');
CALL luoaikaraotpaivalle(2, '2017-08-08');
CALL luoaikaraotpaivalle(2, '2017-08-09');

# luodaan käyttäjiä
INSERT INTO Kayttaja
	(nimi, kayttajatunnus, salasana, asunto) VALUES
	('Ismo Joki', 'river123', 'foryoureyesonly', 'C62'),
	('Riikka Röppönen', 'riksu44', 'jarkko', 'A4'),
	('Hans Eiler', 'hans77', 'auferstandenausruinen', 'D6')
;

# luodaan käyttäjille varauksia

INSERT INTO Varaus
	(tunnusluku, aikarako_id, varaaja_id) VALUES
	("2345", 8, 1), # varataan Ismolle Sauna 2017-08-05 13:00:00
	("0000", 59, 2), # varataan Riikalle pyykkitupa 2017-08-05 16:00:00
	("4242", 60, 3) # varataan Hansille pyykkitupa 2017-08-05 17:00:00
;

# tehdään Hansille lasku pyykkituvan käytöstä

INSERT INTO Lasku
	(summa, maksettu, viitenumero, erapaiva) VALUES
	(1.50, false, 3, '2017-08-17')
;