const database = require("../database");
const Traveler = require("../models/traveler");
const dateUtils = require("../dateUtils");


// Criar um novo viajante
const createTraveler = (req, res) => {
    const { name, birthDate, passportNumber } = req.body;

    if (!name || !birthDate || !passportNumber) {
        return res.status(400).json({ error: "Todos os campos são necessários." });
    }

    const newTraveler = new Traveler(name, birthDate, passportNumber);
    database.travelers.push(newTraveler);

    res.status(201).json({ message: "Viajante criado com sucesso!", newTraveler });
};

// Obter detalhes de um viajante pelo número do passaporte
const getTraveler = (req, res) => {
    const { passportNumber } = req.params;
    const traveler = database.travelers.find(t => t.passportNumber === passportNumber);

    if (!traveler) {
        return res.status(404).json({ error: "Viajante não encontrado." });
    }

    res.status(200).json(traveler);
};

// Validar se o viajante pode viajar para um período de tempo específico
const validateTravel = (req, res) => {
    const { passportNumber } = req.params;
    const { startDate, endDate } = req.body;

    // Validação de datas
    if (!startDate || isNaN(new Date(startDate)) || !endDate || isNaN(new Date(endDate))) {
        return res.status(400).json({ error: "As datas fornecidas são inválidas." });
    }

    // Encontrar o viajante no banco de dados
    const traveler = database.travelers.find(t => t.passportNumber === passportNumber);
    if (!traveler) {
        return res.status(404).json({ error: "Viajante não encontrado." });
    }

    // Regra 1: Não pode viajar antes do nascimento
    if (new Date(startDate) < new Date(traveler.birthDate)) {
        return res.status(400).json({ error: "Não pode viajar antes da data de nascimento." });
    }

    // Buscar todas as infrações do viajante
    const infractions = database.infractions.filter(i => i.passportNumber === passportNumber);

    // Regra 2: Não pode viajar se houver mais de 12 pontos de infrações nos últimos 12 meses
    const totalPoints = infractions
        .filter(i => {
            const isRecent = dateUtils.isWithinLast12Months(i.dateTime); // Verifica se a infração é recente
            console.log(`Data: ${i.dateTime}, Recent: ${isRecent}`); // Log detalhado para depuração
            return isRecent;
        })
        .reduce((sum, i) => sum + dateUtils.getSeverityPoints(i.severity), 0);

    console.log("Pontos totais nos últimos 12 meses:", totalPoints); // Log de pontos

    if (totalPoints > 12) {
        return res.status(400).json({
            error: `O viajante possui ${totalPoints} pontos acumulados nos últimos 12 meses. O limite é 12 pontos.`,
        });
    }

    // Regra 3: Não pode viajar se houver infrações um ano antes ou depois do período de viagem
    const hasConflictingInfractions = infractions.some(i =>
        dateUtils.conflictsWithPeriod(i.dateTime, startDate, endDate)
    );

    if (hasConflictingInfractions) {
        return res.status(400).json({
            error: "O viajante tem infrações perto do período de viagem.",
        });
    }

    // Caso passe por todas as regras, o viajante pode viajar
    res.status(200).json({ message: "O viajante pode viajar." });
};

module.exports = {
    createTraveler,
    getTraveler,
    validateTravel,
};
