const InfractionService = require("../services/infractionService");
const { StatusCodes } = require('http-status-codes');

const createInfraction = (req, res) => {
    const { description, passportNumber, dateTime, severity } = req.body;
    
    try {
        const newInfraction = InfractionService.createInfraction(
            description, 
            passportNumber, 
            dateTime, 
            severity
        );
        res.status(StatusCodes.CREATED).json({ 
            message: "Infração criada com sucesso!", 
            newInfraction 
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getInfractionsByTraveler = (req, res) => {
    const { passportNumber } = req.params;
    
    try {
        const infractions = InfractionService.findByPassport(passportNumber);
        res.status(StatusCodes.OK).json(infractions);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = { createInfraction, getInfractionsByTraveler };
