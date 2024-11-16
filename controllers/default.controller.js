const fs = require('fs');
const csv_parser = require('csv-parser');
const path = require('path');

const getUvod = (req, res) => {
    res.render("index");
};

const getWebInformations = (req, res) => {
  res.render("web_informations");
};

const getNameDay = (req, res) => {

  const filePath = path.join(__dirname, '..', "data", "sk-meniny.csv");
  const meninyMap = {};

  console.log(filePath)
  // async/await nie, lebo nevyužíva Promise, ale callback funkcie a eventy pomocou data, end a error
  // kód, ktorý je v callbacku, sa vykoná až keď sú dáta načítané alebo sa vyskytne chyba

  // fs.creatReadStream  načítava obsah súboru sk-meniny.csv po častiach
  // pipe(csv()) - pipe() presperuje dáta zo súboru do CSV parsera, csv-parser konvertuje každý riadok súboru na javascript objekt
  // pre každý riadok v CSV súbore sa spustí callback funkcia on("data", ...)
  // každý riadok sa uloží do objektu meninyMap podľa dátumu (ako kľúča) a mena (ako hodnoty)

  fs.createReadStream(filePath)
  .pipe(csv_parser({ delimiter: ","}))
  .on("data", (row) => {
    const datum = row["date"];
    const meno = row["name"];
    meninyMap[datum] = meno;

  }).on("end", () => {

    const dnes = new Date();
    const mesiac = String(dnes.getMonth() + 1).padStart(2, '0');
    const den = String(dnes.getDate()).padStart(2, '0');
    const dnesDatum = `${mesiac}-${den}`;
    const dnesMeniny = meninyMap[dnesDatum];

    res.json({
      meno: dnesMeniny

    }).on("error", (error) => {
      console.error("Chyba pri načítaní CSV:", error);
      res.status(500).send("Chyba pri načítaní CSV súboru.");
    });
  });
};

module.exports = {
    getUvod,
    getWebInformations,
    getNameDay,
};