const database = require("../database");
const Infraction = require("../models/infraction");

const createInfraction = (req, res) => {
  const { description, passportNumber, dateTime, severity } = req.body;
  if (!description || !passportNumber || !dateTime || !severity) {
    return res.status(400).json({ error: "Todos os campos são necessários." });
  }

  const newInfraction = new Infraction(description, passportNumber, dateTime, severity);
  database.infractions.push(newInfraction);

  res.status(201).json({ message: "Infração criada com sucesso!", newInfraction });
};

const getInfractionsByTraveler = (req, res) => {
  const { passportNumber } = req.params;
  const infractions = database.infractions.filter(i => i.passportNumber === passportNumber);

  res.status(200).json(infractions);
};

module.exports = { createInfraction, getInfractionsByTraveler };
