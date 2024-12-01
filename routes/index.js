const express = require('express');

const authRoutes = require('./authRoutes');
const travelerRoutes = require('./travelerRoutes');
const infractionRoutes = require('./infractionRoutes');

const { authenticateInspector } = require('../middlewares');

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/travelers', authenticateInspector, travelerRoutes);
router.use('/infractions', authenticateInspector, infractionRoutes);


module.exports = router;