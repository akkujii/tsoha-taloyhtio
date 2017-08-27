# Valitaan ne aikaraot joihin ei kohdistu varausta

SELECT Aikarako.id, Aikarako.kellonaika, Aikarako.paivamaara FROM Aikarako LEFT JOIN Varaus ON Aikarako.id = Varaus.aikarako_id WHERE Varaus.aikarako_id IS NULL AND Aikarako.resurssi_id = 1 AND Aikarako.paivamaara = "2017-08-06";

# Valitaan tietyn aikaraon tiedot:
SELECT Aikarako.id, Aikarako.paivamaara, Aikarako.kellonaika, Aikarako.kesto, Resurssi.resurssinnimi, Resurssi.hinta FROM Aikarako LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id WHERE Aikarako.id = 44;
