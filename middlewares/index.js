
const { authenticateInspector, validateRegister, validateLogin } = require('./authValidations');
const { validateCreateTraveler, validateTravelDates } = require('./travelerValidations');
const { validateCreateInfraction, validateUpdateInfraction } = require('./infractionValidations');

module.exports = {
    authenticateInspector,
    validateRegister,
    validateLogin,
    validateCreateTraveler,
    validateTravelDates,
    validateCreateInfraction,
    validateUpdateInfraction
};
