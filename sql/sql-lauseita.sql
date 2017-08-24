# Valitse ne aikaraot joille ei ole varausta:

SELECT Aikarako.resurssi_id, Aikarako.ajankohta FROM Varaus 
	RIGHT JOIN Aikarako ON Varaus.id = Aikarako.id
		WHERE Varaus.id IS NULL;

