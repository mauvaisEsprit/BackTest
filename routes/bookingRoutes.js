// routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/admin", auth, bookingController.getBookings);
router.put("/admin/:id/confirm", auth, bookingController.confirmBooking);
router.delete("/admin/:id", auth, bookingController.deleteBooking);

module.exports = router;
