const prisma = require('../prisma/client');

class InfractionService {
    static async createInfraction(description, passportNumber, dateTime, severity) {
        return prisma.infraction.create({
            data: {
                description,
                passportNumber,
                dateTime: new Date(dateTime),
                severity
            }
        });
    }

    static async findByPassport(passportNumber) {
        return prisma.infraction.findMany({
            where: { passportNumber }
        });
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