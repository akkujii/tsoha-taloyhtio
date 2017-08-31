# Valitse ne aikaraot joille ei ole varausta:

SELECT Aikarako.resurssi_id, Aikarako.ajankohta FROM Varaus 
	RIGHT JOIN Aikarako ON Varaus.id = Aikarako.id
		WHERE Varaus.id IS NULL;

# Resurssin tietojen päivitys
UPDATE Resurssi SET
resurssinnimi = "Sauna 1",
kayttoaikaalkaa = "14:00:00",
kayttoaikapaattyy = "23:00:00",
varausyksikko = "01:00:00",
hinta = 3.85
WHERE id = 1;

# Varauksen luonti

INSERT INTO Varaus (aikarako_id, varaaja_id) VALUES (86, 1);