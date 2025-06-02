const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/authMiddleware');

router.get('/profile', auth(['driver', 'admin']), driverController.getProfile);
router.put('/update', auth(['driver', 'admin']), driverController.updateProfile);
router.put('/change-password', auth(['driver']), driverController.changePassword);
router.put('/admin-change-password', auth(['admin']), driverController.adminChangePassword);
router.delete('/delete', auth(['admin']), driverController.deleteDriver);

module.exports = router;