// routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/login/admin", auth(["admin"]), bookingController.getBookings);
router.put("/login/admin/:id/confirm", auth(["admin"]), bookingController.confirmBooking);
router.delete("/login/admin/:id", auth(["admin"]), bookingController.deleteBooking);

module.exports = router;
