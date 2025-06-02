// routes/hourlyRoutes.js
const express = require("express");
const hourlyController = require("../controllers/hourlyController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", hourlyController.createHourlyBooking);
router.get("/login/admin", auth(["admin"]), hourlyController.getHourlyBookings);
router.put("/login/admin/:id/confirm", auth(["admin"]), hourlyController.confirmHourlyBooking);
router.delete("/login/admin/:id", auth(["admin"]), hourlyController.deleteHourlyBooking);

module.exports = router;