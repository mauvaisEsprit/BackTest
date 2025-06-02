const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/authMiddleware');

router.get('/profile', auth(['driver', 'admin']), driverController.getProfile);
router.put('/update', auth(['driver', 'admin']), driverController.updateProfile);
router.post('/change-password', auth(['driver', 'admin']), driverController.changePassword);

module.exports = router;