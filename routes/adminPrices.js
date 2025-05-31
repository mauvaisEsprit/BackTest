const express = require("express");
const priceController = require("../controllers/pricesController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.get("/settings", priceController.getPrices); 
router.put("/settings/:id", auth, priceController.updatePrices); 

module.exports = router;