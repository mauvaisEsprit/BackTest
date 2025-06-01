const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/isDriver');

router.get('/', auth, driverController.getProfile);
router.put('/update', auth, driverController.updateProfile);
router.post('/change-password',auth, driverController.changePassword);

module.exports = router;