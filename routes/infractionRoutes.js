const express = require("express");
const router = express.Router();
const { 
    createInfraction, 
    getInfractionsByTraveler,
    updateInfraction,
    deleteInfraction 
} = require("../controllers/infractionController");
const { 
    validateCreateInfraction, 
    validateUpdateInfraction
} = require("../middlewares");

router.post("/", validateCreateInfraction, createInfraction);
router.get("/:passportNumber", getInfractionsByTraveler);
router.put("/:id", validateUpdateInfraction, updateInfraction);
router.delete("/:id", deleteInfraction);

module.exports = router;
