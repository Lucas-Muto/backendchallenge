const { StatusCodes } = require('http-status-codes');

const validateCreateInfraction = (req, res, next) => {
    const { description, passportNumber, dateTime, severity } = req.body;

    if (!description || !passportNumber || !dateTime || !severity) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Todos os campos são necessários." 
        });
    }

    const validSeverities = ["Baixa", "Média", "Grave", "Gravíssima"];
    if (!validSeverities.includes(severity)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Gravidade inválida." 
        });
    }

    next();
};

const validateUpdateInfraction = (req, res, next) => {
    const { description, dateTime, severity } = req.body;
    const validSeverities = ["Baixa", "Média", "Grave", "Gravíssima"];

    if (!description || !dateTime || !severity) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Todos os campos são necessários." 
        });
    }

    if (!validSeverities.includes(severity)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Severidade inválida." 
        });
    }

    if (isNaN(new Date(dateTime))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Data inválida." 
        });
    }

    next();
};

module.exports = {
    validateCreateInfraction,
    validateUpdateInfraction
}; 