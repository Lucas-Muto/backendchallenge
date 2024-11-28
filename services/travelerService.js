const database = require("../database");
const dateUtils = require("../dateUtils");
const Traveler = require("../models/Traveler");
const InfractionService = require("./infractionService");

class TravelerService {
    static findByPassport(passportNumber) {
        return database.travelers.find(t => t.passportNumber === passportNumber);
    }

    static validateTravelEligibility(traveler, startDate, endDate) {
        // Regra 1: Não pode viajar antes do nascimento
        if (new Date(startDate) < new Date(traveler.birthDate)) {
            throw new Error("Não pode viajar antes da data de nascimento.");
        }

        const infractions = database.infractions.filter(i => 
            i.passportNumber === traveler.passportNumber
        );

        // Regra 2: Verificar pontos nos últimos 12 meses
        const totalPoints = this.calculateRecentInfractionPoints(infractions);
        if (totalPoints > 12) {
            throw new Error(
                `O viajante possui ${totalPoints} pontos acumulados nos últimos 12 meses. O limite é 12 pontos.`
            );
        }

        // Regra 3: Verificar infrações próximas ao período
        const travelStart = new Date(Math.min(new Date(startDate), new Date(endDate)));
        const travelEnd = new Date(Math.max(new Date(startDate), new Date(endDate)));
        
        const hasConflictingInfractions = infractions
            .filter(i => !dateUtils.isWithinLast12Months(i.dateTime)) // Only consider older infractions
            .some(infraction => 
                dateUtils.conflictsWithPeriod(
                    infraction.dateTime,
                    travelStart.toISOString().split('T')[0],
                    travelEnd.toISOString().split('T')[0]
                )
            );

        if (hasConflictingInfractions) {
            throw new Error("O viajante tem infrações perto do período de viagem.");
        }

        return true;
    }

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
