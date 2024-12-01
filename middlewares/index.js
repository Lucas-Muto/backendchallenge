
const { authenticateInspector } = require('./authValidations');
const { validateCreateTraveler, validateTravelDates } = require('./travelerValidations');
const { validateCreateInfraction, validateUpdateInfraction } = require('./infractionValidations');

module.exports = {
    authenticateInspector,
    validateCreateTraveler,
    validateTravelDates,
    validateCreateInfraction,
    validateUpdateInfraction
};
