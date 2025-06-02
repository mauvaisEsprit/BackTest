const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/authMiddleware');

router.get('/profile', auth(['driver']), driverController.getProfile);
router.put('/update', auth(['driver']), driverController.updateProfile);
router.post('/change-password', auth(['driver']), driverController.changePassword);

module.exports = router;