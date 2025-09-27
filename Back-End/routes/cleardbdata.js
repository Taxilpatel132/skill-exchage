const express = require('express');
const router = express.Router();
const clearDbController = require('../controllers/clearDb.controller');
const authMiddleware = require('../auth-middleware/auth');

// Clear all data from all models (requires authentication)
router.delete('/clear-all', clearDbController.clearAllData);
router.post('/add-admin', clearDbController.addAdmin);


module.exports = router;
