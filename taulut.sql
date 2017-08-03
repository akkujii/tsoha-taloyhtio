# Create table -lauseet

CREATE TABLE Resurssi (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	kayttoaikaalkaa TIME,				# oletusarvoinen kellonaika jolloin on mahdollista tehdä ensimmäinen varaus
	kayttoaikapaattyy TIME,				# oletusarvoinen kellonaika jonka jälkeen ei ole enää mahdollista tehdä varauksia
	varausyksikko TIME,					# varauksen kesto minuutteina
	resurssinnimi varchar(8),			# resurssin nimi (sauna, pyykkitupa jne.)
	hinta DECIMAL(4,2)					# varausyksikön hinta
);

CREATE TABLE Aikarako (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	resurssi_id int,
	aika DATETIME,
	kesto time,
	FOREIGN KEY (resurssi_id) REFERENCES Resurssi(id) ON DELETE CASCADE
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

CREATE TABLE Kayttaja ( 
	id int NOT NULL AUTO_INCREMENT,
	nimi varchar(64),
	salasana varchar(64),
	asunto varchar(64),
);

CREATE TABLE Lasku (
	id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id),
	maksettu boolean,
	viitenumero 
);

# luo annetulle päivämäärälle määrä aikarakoja
# ensimmäinen mahdollinen iakarako on resurssi-taulun kattoaikaalkaa-sarake
# 

SET @takaraja = (SELECT kayttoaikapaattyy FROM Resurssi WHERE id = 2); 
SET @i = (SELECT kayttoaikaalkaa FROM Resurssi WHERE id = 2);
SET @incr = (SELECT varausyksikko FROM Resurssi WHERE id = 2);


delimiter //

CREATE PROCEDURE luoaikaraotpaivalle(res int, pvm datetime)
  BEGIN
    SET @takaraja = ADDTIME(pvm, (SELECT kayttoaikapaattyy FROM Resurssi WHERE id = 2)); 
	SET @i = ADDTIME(pvm, (SELECT kayttoaikaalkaa FROM Resurssi WHERE id = 2));
	SET @incr = (SELECT varausyksikko FROM Resurssi WHERE id = 2);
    REPEAT
    	INSERT INTO Aikarako (resurssi_id, aika, kesto) VALUES (res, @i, @incr);
    	SET @i = ADDTIME(@i, @incr);
    	UNTIL @i = @takaraja END REPEAT;
  END
//

DELIMITER ;



CALL dorepeat(1000)//

SELECT @x//
+------+
| @x   |
+------+
| 1001 |
+------+




SELECT ((SELECT varausyksikko FROM Resurssi WHERE id = 1) * 100);


SET @i = ADDTIME


delimiter //
CREATE PROCEDURE lisaaaikaraotpaivalle(paiva int, resurssi int)
	SELECT 
	BEGIN
		SET @I = 

	END
//

CREATE PROCEDURE looppitesti(par int)
	BEGIN
	SET @X = "Hei";
		SET @I = 0;
		REPEAT
			SELECT @X;
			SET @I = @I + 1;
		UNTIL @I  = 5 END REPEAT;
	END

# Testiaineisto

INSERT INTO Resurssi
	(kayttoaikaalkaa, kayttoaikapaattyy, varausyksikko, resurssinnimi, hinta) VALUES
	('150000', '230000', '10000', 'sauna', '3.84')
;

