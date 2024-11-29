const InfractionService = require("../services/infractionService");
const { StatusCodes } = require('http-status-codes');

const createInfraction = (req, res) => {
    const { description, passportNumber, dateTime, severity } = req.body;
    
    InfractionService.createInfraction(
            description, 
            passportNumber, 
            dateTime, 
            severity
        ).then(newInfraction => {
            res.status(StatusCodes.CREATED).json({ 
                message: "Infração criada com sucesso!", 
                newInfraction 
            });
        }).catch(error => {
            res.status(StatusCodes.BAD_REQUEST).json({ error: `Houve um erro ao criar a infração: ${error.message}` });
        });
   
};

const getInfractionsByTraveler = (req, res) => {
    const { passportNumber } = req.params;
    
    InfractionService.findByPassport(passportNumber).then(infractions => {
        res.status(StatusCodes.OK).json(infractions);
    }).catch(error => {
        res.status(StatusCodes.BAD_REQUEST).json({ error: `Houve um erro ao buscar as infrações: ${error.message}` });
    });
};

module.exports = { createInfraction, getInfractionsByTraveler };
