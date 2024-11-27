const express = require("express");
const router = express.Router();
const { createTraveler, getTraveler, validateTravel } = require("../controllers/travelerController");

// Rotas
router.post("/", createTraveler);
router.get("/:passportNumber", getTraveler);
router.post("/:passportNumber/validate", validateTravel); // Verifique esta linha

module.exports = router;
