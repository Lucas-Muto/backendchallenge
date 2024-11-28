const express = require("express");
const router = express.Router();
const { createInfraction, getInfractionsByTraveler } = require("../controllers/infractionController");
const { validateCreateInfraction } = require("../middlewares/infractionValidations");

router.post("/", validateCreateInfraction, createInfraction);
router.get("/:passportNumber", getInfractionsByTraveler);

module.exports = router;
