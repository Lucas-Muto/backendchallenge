const express = require("express");
const { 
    createTraveler, 
    getTraveler, 
    validateTravel,
    updateTraveler,
    deleteTraveler 
} = require("../controllers/travelerController");
const { validateCreateTraveler, validateTravelDates } = require("../middlewares");

const router = express.Router();

router.post("/", validateCreateTraveler, createTraveler);
router.get("/:passportNumber", getTraveler);
router.put("/:passportNumber", validateCreateTraveler, updateTraveler);
router.delete("/:passportNumber", deleteTraveler);
router.post("/:passportNumber/validate", validateTravelDates, validateTravel);

module.exports = router;
