const database = require("../database");
const dateUtils = require("../dateUtils");
const Traveler = require("../models/Traveler");
const InfractionService = require("./infractionService");

class TravelerService {
    static findByPassport(passportNumber) {
        return database.travelers.find(t => t.passportNumber === passportNumber);
    }

    static getTravelerInfractions(passportNumber) {
        return database.infractions.filter(i => i.passportNumber === passportNumber);
    }

    static validateTravelEligibility(traveler, endDate) {
        const birthDate = new Date(traveler.birthDate);
        const travelEnd = new Date(endDate);
        
        // Regra 1: Não pode viajar antes do nascimento (checking both dates)
        if (travelEnd < birthDate) {
            throw new Error("Não pode viajar antes da data de nascimento.");
        }

        const infractions = this.getTravelerInfractions(traveler.passportNumber);

        // Regra 2: Verificar pontos nos últimos 12 meses
        const totalPoints = this.calculateRecentInfractionPoints(infractions);
        if (totalPoints > 12) {
            throw new Error(
                `O viajante possui ${totalPoints} pontos acumulados nos últimos 12 meses. O limite é 12 pontos.`
            );
        }

        // Regra 3: Verificar infrações próximas ao período
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

    // Verifica se uma data de infração conflita com um intervalo de viagem
    //O viajante não pode viajar se tiver cometido qualquer tipo de infração um ano antes ou depois do período desejado.
    static conflictsWithPeriod = (infractionDate, endDate) => {
        const infractionDateTime = new Date(infractionDate);
        const travelEndDate = new Date(endDate);
    
        // Calculate the boundaries (1 year before start and 1 year after end)
        const oneYearBeforeEnd = new Date(travelEndDate);
        oneYearBeforeEnd.setFullYear(travelEndDate.getFullYear() - 1);
        
        const oneYearAfterEnd = new Date(travelEndDate);
        oneYearAfterEnd.setFullYear(travelEndDate.getFullYear() + 1);
    
        // Check if the infraction date falls within the restricted period
        const isConflicted =  infractionDateTime >= oneYearBeforeEnd && infractionDateTime <= oneYearAfterEnd;
        
        return isConflicted;
      }; 

    static calculateRecentInfractionPoints(infractions) {
        return infractions
            .filter(i => dateUtils.isWithinLast12Months(i.dateTime))
            .reduce((sum, i) => sum + InfractionService.getSeverityPoints(i.severity), 0);
    }

    static createTraveler(name, birthDate, passportNumber) {
        // Você pode adicionar validações comerciais adicionais aqui
        // Por exemplo, verificar se o número do passaporte é único
        const existingTraveler = this.findByPassport(passportNumber);
        if (existingTraveler) {
            throw new Error("Já existe um viajante com este número de passaporte.");
        }

        const newTraveler = new Traveler(name, birthDate, passportNumber);
        database.travelers.push(newTraveler);
        return newTraveler;
    }
}

module.exports = TravelerService; 
