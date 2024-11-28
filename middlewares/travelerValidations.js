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
    const { startDate, endDate } = req.body;

    if (!startDate || isNaN(new Date(startDate)) || !endDate || isNaN(new Date(endDate))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "As datas fornecidas são inválidas." 
        });
    }

    next();
};

module.exports = {
    validateCreateTraveler,
    validateTravelDates
}; 