const express = require("express");
const router = express.Router();
const { createInfraction, getInfractionsByTraveler } = require("../controllers/infractionController");

router.post("/", createInfraction);
router.get("/:passportNumber", getInfractionsByTraveler);

module.exports = router;
