const InfractionService = require("../services/infractionService");
const { StatusCodes } = require('http-status-codes');
const { PRISMA_NOT_FOUND_ERROR } = require('../utils/constants');
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

const updateInfraction = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedInfraction = await InfractionService.updateInfraction(parseInt(id), updateData);
        res.status(StatusCodes.OK).json({
            message: "Infração atualizada com sucesso!",
            infraction: updatedInfraction
        });
    } catch (error) {
        if (error.code === PRISMA_NOT_FOUND_ERROR) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Infração não encontrada." });
        }
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const deleteInfraction = async (req, res) => {
    const { id } = req.params;

    try {
        await InfractionService.deleteInfraction(parseInt(id));
        res.status(StatusCodes.OK).json({
            message: "Infração removida com sucesso!"
        });
    } catch (error) {
        if (error.code === PRISMA_NOT_FOUND_ERROR) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Infração não encontrada." });
        }
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = { 
    createInfraction, 
    getInfractionsByTraveler,
    updateInfraction,
    deleteInfraction 
};
