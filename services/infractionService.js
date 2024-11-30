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

    static async updateInfraction(id, data) {
        return prisma.infraction.update({
            where: { id },
            data: {
                description: data.description,
                dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
                severity: data.severity
            }
        });
    }

    static async deleteInfraction(id) {
        return prisma.infraction.delete({
            where: { id }
        });
    }
}

module.exports = InfractionService; 