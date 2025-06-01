const express = require("express");
const priceController = require("../controllers/pricesController");
const driverController = require("../controllers/driverController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.get("/settings", priceController.getPrices); 
router.put("/settings/:id", auth, priceController.updatePrices); 
router.post('/register', auth, driverController.registerDriver);
router.get('/drivers', auth, driverController.getAllDrivers);


module.exports = router;