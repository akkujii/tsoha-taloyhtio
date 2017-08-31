# Create table -lauseet

CREATE TABLE Resurssi (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	resurssinnimi varchar(32),			# resurssin nimi (sauna, pyykkitupa jne.)
	kayttoaikaalkaa TIME,				# oletusarvoinen kellonaika jolloin on mahdollista tehdä ensimmäinen varaus
	kayttoaikapaattyy TIME,				# oletusarvoinen kellonaika jonka jälkeen ei ole enää mahdollista tehdä varauksia
	varausyksikko TIME,					# varauksen kesto minuutteina
	hinta DECIMAL(4,2)					# varausyksikön hinta
);

CREATE TABLE Aikarako (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	resurssi_id int,
	FOREIGN KEY (resurssi_id) REFERENCES Resurssi(id) ON DELETE CASCADE,
	paivamaara DATE,
	kellonaika TIME,
	kesto time	
);

CREATE TABLE Kayttaja ( 
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	nimi varchar(64),
	kayttajatunnus varchar(32),
	salasana varchar(64),
	asunto varchar(64)
	kayttooikeus ENUM('hallinto', 'asukas') DEFAULT ('asukas')
);

CREATE TABLE Lasku (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	maksettu boolean,
	summa decimal(7,2),
	viitenumero int,
	erapaiva DATE
);

CREATE TABLE Varaus (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	tunnusluku varchar(4),
	aikarako_id int,
	FOREIGN KEY (aikarako_id) REFERENCES Aikarako(id) ON DELETE CASCADE,
	varaaja_id int,
	FOREIGN KEY (varaaja_id) REFERENCES Kayttaja(id) ON DELETE CASCADE,
	lasku_id int,
	FOREIGN KEY (lasku_id) REFERENCES Lasku(id) 
);

# luo annetulle päivämäärälle määrä aikarakoja
# ensimmäinen mahdollinen aikarako on resurssi-taulun kattoaikaalkaa-sarake

delimiter //

CREATE PROCEDURE luoaikaraotpaivalle(res int, pvm date)
  BEGIN
    SET @takaraja = (SELECT kayttoaikapaattyy FROM Resurssi WHERE id = res); 
	SET @i = (SELECT kayttoaikaalkaa FROM Resurssi WHERE id = res);
	SET @incr = (SELECT varausyksikko FROM Resurssi WHERE id = res);
    REPEAT
    	INSERT INTO Aikarako (resurssi_id, paivamaara, kellonaika, kesto) VALUES (res, pvm, @i, @incr);
    	SET @i = ADDTIME(@i, @incr);
    	UNTIL @i = @takaraja END REPEAT;
  END
//

DELIMITER ;

