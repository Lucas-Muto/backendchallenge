const prisma = require('../prisma/client');
const dateUtils = require("../dateUtils");

class TravelerService {
    static async findByPassport(passportNumber) {
        return prisma.traveler.findUnique({
            where: { passportNumber }
        });
    }

    static async getTravelerInfractions(passportNumber) {
        return prisma.infraction.findMany({
            where: { passportNumber }
        });
    }

    static async validateTravelEligibility(traveler, endDate) {
        const birthDate = traveler.birthDate;
        const travelEnd = new Date(endDate);
        
        if (travelEnd < birthDate) {
            throw new Error("Não pode viajar antes da data de nascimento.");
        }

        const infractions = await this.getTravelerInfractions(traveler.passportNumber);
        
        const totalPoints = await this.calculateRecentInfractionPoints(infractions);
        if (totalPoints > 12) {
            throw new Error(
                `O viajante possui ${totalPoints} pontos acumulados nos últimos 12 meses. O limite é 12 pontos.`
            );
        }

        const infractionsNotWithinLast12Months = infractions
            .filter(i => !dateUtils.isWithinLast12Months(i.dateTime));

        const hasConflictingInfractions = infractionsNotWithinLast12Months
            .some(infraction => 
                this.conflictsWithPeriod(
                    infraction.dateTime,
                    travelEnd.toISOString().split('T')[0]
                )
            );

        if (hasConflictingInfractions) {
            throw new Error("O viajante tem infrações perto do período de viagem.");
        }

        return true;
    }

    static async createTraveler(name, birthDate, passportNumber) {
        return prisma.traveler.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                passportNumber
            }
        });
    }

    static calculateRecentInfractionPoints(infractions) {
        return infractions
            .filter(i => dateUtils.isWithinLast12Months(i.dateTime))
            .reduce((sum, i) => sum + InfractionService.getSeverityPoints(i.severity), 0);
    }

    static conflictsWithPeriod = (infractionDate, endDate) => {
        const infractionDateTime = new Date(infractionDate);
        const travelEndDate = new Date(endDate);
    
        const oneYearBeforeEnd = new Date(travelEndDate);
        oneYearBeforeEnd.setFullYear(travelEndDate.getFullYear() - 1);
        
        const oneYearAfterEnd = new Date(travelEndDate);
        oneYearAfterEnd.setFullYear(travelEndDate.getFullYear() + 1);
    
        const isConflicted =  infractionDateTime >= oneYearBeforeEnd && infractionDateTime <= oneYearAfterEnd;
        
        return isConflicted;
      }; 
}

module.exports = TravelerService; 
