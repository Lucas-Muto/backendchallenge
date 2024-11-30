const express = require("express");
const router = express.Router();
const { 
    createTraveler, 
    getTraveler, 
    validateTravel,
    updateTraveler,
    deleteTraveler 
} = require("../controllers/travelerController");
const { validateCreateTraveler, validateTravelDates } = require("../middlewares/travelerValidations");

router.post("/", validateCreateTraveler, createTraveler);
router.get("/:passportNumber", getTraveler);
router.put("/:passportNumber", validateCreateTraveler, updateTraveler);
router.delete("/:passportNumber", deleteTraveler);
router.post("/:passportNumber/validate", validateTravelDates, validateTravel);

module.exports = router;
