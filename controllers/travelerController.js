const TravelerService = require("../services/travelerService");
const { StatusCodes } = require('http-status-codes');

const createTraveler = (req, res) => {
    const { name, birthDate, passportNumber } = req.body;
    
    TravelerService.createTraveler(name, birthDate, passportNumber).then(traveler => {
        res.status(StatusCodes.CREATED).json({ 
                message: "Viajante criado com sucesso!", 
                    traveler 
            });
        }).catch(error => {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        });
    
};

const getTraveler = (req, res) => {
    const { passportNumber } = req.params;
    TravelerService.findByPassport(passportNumber).then(traveler => {
        if (!traveler) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Viajante não encontrado." });
        }
        res.status(StatusCodes.OK).json(traveler);
    }).catch(error => {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }).finally(() => {
        console.log("Operacao de recuperacao de viajante finalizada");
    });
};

const validateTravel = (req, res) => {
    const { passportNumber } = req.params;
    const { endDate } = req.body;

    TravelerService.findByPassport(passportNumber).then(traveler => {
        if (!traveler) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Viajante não encontrado." });
        }

        TravelerService.validateTravelEligibility(traveler, endDate).then(() => {
            res.status(StatusCodes.OK).json({ message: "O viajante pode viajar." });
        }).catch(error => {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        });
    });
};

module.exports = {
    createTraveler,
    getTraveler,
    validateTravel,
};
