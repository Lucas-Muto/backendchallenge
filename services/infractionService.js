const database = require("../database");
const Infraction = require("../models/infraction");
const dateUtils = require("../dateUtils");

class InfractionService {
    static createInfraction(description, passportNumber, dateTime, severity) {
        if (!description || !passportNumber || !dateTime || !severity) {
            throw new Error("Todos os campos são necessários.");
        }

        const newInfraction = new Infraction(description, passportNumber, dateTime, severity);
        database.infractions.push(newInfraction);
        return newInfraction;
    }

    static findByPassport(passportNumber) {
        return database.infractions.filter(i => i.passportNumber === passportNumber);
    }

    static getSeverityPoints(severity) {
        const points = {
            "Baixa": 3,
            "Média": 5,
            "Grave": 7,
            "Gravíssima": 12,
        };
    
        return points[severity] || 0;
    }
}

module.exports = InfractionService; 