const express = require("express");
const priceController = require("../controllers/pricesController");
const driverController = require("../controllers/driverController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/settings", priceController.getPrices); 
router.put("/settings/:id", auth(["admin"]), priceController.updatePrices); 
router.post('/register', auth(["admin"]), driverController.registerDriver);
router.get('/drivers', auth(["admin"]), driverController.getAllDrivers);


module.exports = router;