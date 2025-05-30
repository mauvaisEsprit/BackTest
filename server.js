require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Подключаемся к MongoDB
const connectDB = require("./config/db");
connectDB();

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

const hourlyRoutes = require("./routes/hourlyRoutes");
app.use("/api/hourly", hourlyRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const adminRoutes = require("./routes/adminAuth");
app.use("/api/admin", adminRoutes);

const pingRoute = require("./routes/pingRoute");
app.use("/", pingRoute);


// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

