const express = require("express");
const router = express.Router();
const { createTraveler, getTraveler, validateTravel } = require("../controllers/travelerController");
const { validateCreateTraveler, validateTravelDates } = require("../middlewares/travelerValidations");

router.post("/", validateCreateTraveler, createTraveler);
router.get("/:passportNumber", getTraveler);
router.post("/:passportNumber/validate", validateTravelDates, validateTravel);

module.exports = router;
