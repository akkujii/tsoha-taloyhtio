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

# luodaan asukaskäyttäjiä
INSERT INTO Kayttaja
	(nimi, kayttajatunnus, salasana, asunto) VALUES
	('Ismo Joki', 'river123', 'foryoureyesonly', 'C62'),
	('Riikka Röppönen', 'riksu44', 'jarkko', 'A4'),
	('Hans Eiler', 'hans77', 'auferstandenausruinen', 'D6')
;

# luodaan isännöitsijä/hallintokäyttäjä
INSERT INTO Kayttaja
	(nimi, kayttajatunnus, salasana, kayttooikeus) VALUES
	('Ilpo Isännöitsijä', 'ilpo57', 'm3rc3d3s', 'hallinto')
;


# luodaan käyttäjille varauksia

INSERT INTO Varaus
	(tunnusluku, aikarako_id, varaaja_id) VALUES
	("2345", 8, 1), # varataan Ismolle Sauna 2017-08-05 13:00:00
	("0000", 59, 2), # varataan Riikalle pyykkitupa 2017-08-05 16:00:00
	("4242", 60, 3), # varataan Hansille pyykkitupa 2017-08-05 17:00:00
	
	("4321", 4, 1), # varataan Ismolle Sauna','2017-08-05','17:00:00'
	("5432", 5, 2), # varataan Riikalle Sauna','2017-08-05','18:00:00'
	("4321", 6, 3), # varataan Hansille 'Sauna','2017-08-05','19:00:00'
	("5432", 29, 1), # varataan Ismolle Pyykkitupa', '2017-08-05', '09:00:00'
	("4322", 30, 2), # varataan Riikalle Pyykkitupa', '2017-08-05', '10:00:00'
	("4591", 31, 3), # varataan Hansille  'Pyykkitupa', '2017-08-05', '11:00:00'
	("1234", 46, 1) # varataan Ismolle Pyykkitupa', '2017-08-06', '10:00:00'
;

# tehdään Hansille lasku pyykkituvan käytöstä

INSERT INTO Lasku
	(summa, maksettu, viitenumero, erapaiva) VALUES
	(1.50, false, 3, '2017-08-17')
;