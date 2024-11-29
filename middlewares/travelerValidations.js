const { StatusCodes } = require('http-status-codes');

const validateCreateTraveler = (req, res, next) => {
    const { name, birthDate, passportNumber } = req.body;

    if (!name || !birthDate || !passportNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Todos os campos são necessários." 
        });
    }

    next();
};

const validateTravelDates = (req, res, next) => {
    const { endDate } = req.body;

    if (!endDate || isNaN(new Date(endDate))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "A data fornecida é inválida." 
        });
    }

    next();
};

module.exports = {
    validateCreateTraveler,
    validateTravelDates
}; 