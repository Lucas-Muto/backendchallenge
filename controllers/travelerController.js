const TravelerService = require("../services/travelerService");
const { StatusCodes } = require('http-status-codes');

const createTraveler = (req, res) => {
    const { name, birthDate, passportNumber } = req.body;
    
    try {
        const newTraveler = TravelerService.createTraveler(name, birthDate, passportNumber);
        res.status(StatusCodes.CREATED).json({ 
            message: "Viajante criado com sucesso!", 
            newTraveler 
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getTraveler = (req, res) => {
    const { passportNumber } = req.params;
    const traveler = TravelerService.findByPassport(passportNumber);

    if (!traveler) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Viajante não encontrado." });
    }

    res.status(StatusCodes.OK).json(traveler);
};

const validateTravel = (req, res) => {
    const { passportNumber } = req.params;
    const { startDate, endDate } = req.body;

    const traveler = TravelerService.findByPassport(passportNumber);
    if (!traveler) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Viajante não encontrado." });
    }

    try {
        TravelerService.validateTravelEligibility(traveler, startDate, endDate);
        res.status(StatusCodes.OK).json({ message: "O viajante pode viajar." });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createTraveler,
    getTraveler,
    validateTravel,
};
