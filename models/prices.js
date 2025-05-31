const mongoose = require("mongoose");

const pricesSchema = new mongoose.Schema({
  locale: { type: String, default: "fr" },
  pricePerKm: { type: Number, required: true },
  pricePerMin: { type: Number, required: true },
  minFare: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prices", pricesSchema, "prices");
