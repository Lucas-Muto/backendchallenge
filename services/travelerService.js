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

        // Regra 3: Verificar infrações próximas ao período
        const hasConflictingInfractions = infractions.some(i =>
            dateUtils.conflictsWithPeriod(i.dateTime, startDate, endDate)
        );

        if (hasConflictingInfractions) {
            throw new Error("O viajante tem infrações perto do período de viagem.");
        }

        // Regra 2: Verificar pontos nos últimos 12 meses
        const totalPoints = this.calculateRecentInfractionPoints(infractions);
        
        if (totalPoints > 12) {
            throw new Error(
                `O viajante possui ${totalPoints} pontos acumulados nos últimos 12 meses. O limite é 12 pontos.`
            );
        }

        return true;
    }

    static calculateRecentInfractionPoints(infractions) {
        return infractions
            .filter(i => dateUtils.isWithinLast12Months(i.dateTime))
            .reduce((sum, i) => sum + InfractionService.getSeverityPoints(i.severity), 0);
    }

    static createTraveler(name, birthDate, passportNumber) {
        // You could add additional business validations here
        // For example, checking if passport number is unique
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
