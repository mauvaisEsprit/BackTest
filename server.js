const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Схема для первой формы (Обычная поездка)
const bookingSchema1 = new mongoose.Schema({
  from: String,
  to: String,
  date: Date,
  returnDate: Date,
  adults: Number,
  children: Number,
  name: String,
  phone: String,
  email: String,
  baggage: String,
  comment: String,
  isRoundTrip: Boolean,
  price: Number,
  duration: Number,
  tripPurpose: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking1 = mongoose.model("Booking1", bookingSchema1);

// Схема для второй формы (Почасовая аренда)
const bookingSchema2 = new mongoose.Schema({
  pickupLocation: String,
  duration: Number,
  date: Date,
  name: String,
  phone: String,
  email: String,
  tripPurpose: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking2 = mongoose.model("Booking2", bookingSchema2);

// Настройка nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// --- Первый роут — обычная поездка ---
app.post("/api/bookings/form1", async (req, res) => {
  try {
    console.log("Form1 request body:", req.body);

    const {
      from,
      to,
      date,
      returnDate,
      adults,
      children,
      name,
      phone,
      email,
      baggage,
      comment,
      isRoundTrip,
      price,
      garant,
      duration,
      tripPurpose,
    } = req.body;

    if (!from || !date || !name || !phone || !email || !garant) {
      return res.status(400).json({ message: "Отсутствуют обязательные поля." });
    }

    const booking = new Booking1({
      from,
      to,
      date,
      returnDate,
      adults,
      children,
      name,
      phone,
      email,
      baggage,
      comment,
      isRoundTrip,
      price,
      garant,
      duration,
      tripPurpose,
    });

    await booking.save();

    const confirmUrl = `https://backtest1-0501.onrender.com/api/bookings/confirm1/${booking._id}`;

    // Письмо админу
    const mailOptionsAdmin = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Новая заявка на бронирование (Обычная поездка)",
      html: `
        <h2>Новая заявка на бронирование (Обычная поездка)</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Откуда:</b> ${from}</p>
        <p><b>Куда:</b> ${to}</p>
        <p><b>Дата:</b> ${new Date(date).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
        <p><b>Обратная дата:</b> ${
          returnDate
            ? new Date(returnDate).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "не указано"
        }</p>
        <p><b>Взрослые:</b> ${adults || 0}</p>
        <p><b>Дети:</b> ${children || 0}</p>
        <p><b>Багаж:</b> ${baggage || "не указано"}</p>
        <p><b>Комментарии:</b> ${comment || "не указано"}</p>
        <p><b>Согласие с условиями:</b> ${garant ? "Да" : "Нет"}</p>
        <p>Подтвердить заявку: <a href="${confirmUrl}">Подтвердить бронирование</a></p>
      `,
    };

    await transporter.sendMail(mailOptionsAdmin);

    res
      .status(200)
      .json({ message: "Заявка формы 1 отправлена, ожидайте подтверждения." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// --- Второй роут — почасовая аренда ---
app.post("/api/bookings/form2", async (req, res) => {
  try {
    console.log("Form2 request body:", req.body);

    const {
      pickupLocation,
      duration,
      date,
      name,
      phone,
      email,
      tripPurpose,
      garant,
    } = req.body;

    if (
      !pickupLocation ||
      !duration ||
      !date ||
      !name ||
      !phone ||
      !email ||
      !garant
    ) {
      return res.status(400).json({ message: "Отсутствуют обязательные поля" });
    }

    const booking = new Booking2({
      pickupLocation,
      duration,
      date,
      name,
      phone,
      email,
      tripPurpose,
      garant,
    });

    await booking.save();

    const confirmUrl = `https://backtest1-0501.onrender.com/api/bookings/confirm2/${booking._id}`;

    // Письмо админу
    const mailOptionsAdmin = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Новая заявка на бронирование (Почасовая аренда)",
      html: `
        <h2>Новая заявка на бронирование (Почасовая аренда)</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Место подачи:</b> ${pickupLocation}</p>
        <p><b>Длительность:</b> ${duration} ч.</p>
        <p><b>Дата:</b> ${new Date(date).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
        <p><b>Цель поездки:</b> ${tripPurpose || "не указано"}</p>
        <p><b>Согласие с условиями:</b> ${garant ? "Да" : "Нет"}</p>
        <p>Подтвердить заявку: <a href="${confirmUrl}">Подтвердить бронирование</a></p>
      `,
    };

    await transporter.sendMail(mailOptionsAdmin);

    res
      .status(200)
      .json({ message: "Заявка формы 2 отправлена, ожидайте подтверждения." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// --- Подтверждение бронирования формы 1 ---
app.get("/api/bookings/confirm1/:id", async (req, res) => {
  try {
    const booking = await Booking1.findById(req.params.id);
    if (!booking) return res.status(404).send("Заявка не найдена");

    if (booking.confirmed) return res.send("Заявка уже подтверждена");

    booking.confirmed = true;
    await booking.save();

    const mailOptionsClient = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: "Ваше бронирование подтверждено.",
      html: `
        <h2>Спасибо, ${booking.name}!</h2>
        <p>Ваше бронирование обычной поездки подтверждено.</p>
        <p><b>Дата:</b> ${new Date(booking.date).toLocaleString()}</p>
        <p><b>Место подачи:</b> ${booking.from}</p>
        <p><b>Длительность:</b> ${booking.duration || "не указано"} ч.</p>
        <p>Ждём вас!</p>
      `,
    };

    await transporter.sendMail(mailOptionsClient);

    res.send("Бронирование успешно подтверждено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Подтверждение бронирования формы 2 ---
app.get("/api/bookings/confirm2/:id", async (req, res) => {
  try {
    const booking = await Booking2.findById(req.params.id);
    if (!booking) return res.status(404).send("Заявка не найдена");

    if (booking.confirmed) return res.send("Заявка уже подтверждена");

    booking.confirmed = true;
    await booking.save();

    const mailOptionsClient = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: "Ваше бронирование подтверждено (Почасовая аренда)",
      html: `
        <h2>Спасибо, ${booking.name}!</h2>
        <p>Ваше бронирование почасовой аренды подтверждено.</p>
        <p><b>Дата:</b> ${new Date(booking.date).toLocaleString()}</p>
        <p><b>Место подачи:</b> ${booking.pickupLocation}</p>
        <p><b>Длительность:</b> ${booking.duration} ч.</p>
        <p>Ждём вас!</p>
      `,
    };

    await transporter.sendMail(mailOptionsClient);

    res.send("Бронирование успешно подтверждено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
