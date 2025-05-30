// routes/hourlyRoutes.js
const express = require("express");
const hourlyController = require("../controllers/hourlyController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.post("/", hourlyController.createHourlyBooking);
router.get("/admin", auth, hourlyController.getHourlyBookings);
router.put("/admin/:id/confirm", auth, hourlyController.confirmHourlyBooking);
router.delete("/admin/:id", auth, hourlyController.deleteHourlyBooking);

module.exports = router;