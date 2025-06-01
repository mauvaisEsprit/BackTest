// routes/hourlyRoutes.js
const express = require("express");
const hourlyController = require("../controllers/hourlyController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.post("/", hourlyController.createHourlyBooking);
router.get("/login/admin", auth, hourlyController.getHourlyBookings);
router.put("/login/admin/:id/confirm", auth, hourlyController.confirmHourlyBooking);
router.delete("/login/admin/:id", auth, hourlyController.deleteHourlyBooking);

module.exports = router;