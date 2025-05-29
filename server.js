const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const moment = require("moment-timezone");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

//const adminRoutes = require("./routes/adminRoutes");
const isAdmin = require("./middleware/isAdmin");

// Настройка i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "ru",
    backend: {
      loadPath: path.join(__dirname, "/locales/{{lng}}/translation.json"),
    },
    detection: {
      // Определяем язык по заголовку Accept-Language, можно настроить куки и т.д.
      order: ["header"],
      caches: false,
    },
  });

 

const app = express();
app.use(cors());
app.use(express.json());
app.use(middleware.handle(i18next));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Схема для первой формы (Обычная поездка)
const bookingSchema1 = new mongoose.Schema({
  locale: { type: String, default: "ru" },
  from: String,
  to: String,
  date: Date,
  returnDate: Date,
  adults: Number,
  children: Number,
  name: String,
  phone: String,
  email: String,
  baggage: Boolean,
  comment: String,
  isRoundTrip: Boolean,
  price: Number,
  duration: Number,
  id: String,
  tripPurpose: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking1 = mongoose.model("Booking1", bookingSchema1, "bookings");

// Схема для второй формы (Почасовая аренда)
const bookingSchema2 = new mongoose.Schema({
  locale: { type: String, default: "ru" },
  pickupLocation: String,
  duration: Number,
  date: Date,
  name: String,
  phone: String,
  email: String,
  tripPurpose: String,
  totalPrice: Number,
  id: String,
  garant: Boolean,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Booking2 = mongoose.model("Booking2", bookingSchema2, "bookings");

// Настройка nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});





const getAllBookings = async (req, res) => {
  try {
    const bookings1 = await Booking1.find().sort({ createdAt: -1 });
    const bookings2 = await Booking2.find().sort({ createdAt: -1 });

    const allBookings = [...bookings1].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


app.get("/api/admin/bookings", isAdmin, getAllBookings);





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
      locale = "fr", // Добавляем язык, по умолчанию "fr"
    } = req.body;

    if (!from || !date || !name || !phone || !email || !garant) {
      return res
        .status(400)
        .json({ message: "Отсутствуют обязательные поля." });
    }

    // Генерируем уникальный ID для бронирования
    const newId = uuidv4();

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
      locale,
      id: newId, // Генерируем уникальный ID, если не передан
      type: "form1",
    });
    const parisDate = moment(booking.date)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm");
    await booking.save();

    const parisReturnDate = booking.returnDate
      ? moment(booking.returnDate).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
      : i18next.t("email.not_specified");

    await booking.save();

    const normPrice =
      typeof booking.price === "number"
        ? booking.price.toFixed(2)
        : "не указано";

    //const confirmUrl = `https://backtest1-0501.onrender.com/api/bookings/confirm1/${booking._id}`;

    const typeOfTrip = isRoundTrip
      ? i18next.t("email.round_trip")
      : i18next.t("email.one_way_trip");

    // Письмо админу
    const mailOptionsAdmin = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `Новая заявка на бронирование (${typeOfTrip})`,
      html: `
        <h2>Новая заявка на бронирование (${typeOfTrip})</h2>
        <p><b>Номер бронирования:</b> ${newId}</p>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Откуда:</b> ${from}</p>
        <p><b>Куда:</b> ${to}</p>
        <p><b>Дата:</b> ${parisDate}</p>
        <p><b>Обратная дата:</b> ${
          isRoundTrip ? parisReturnDate : "не указана"
        }</p>
        <p><b>Взрослые:</b> ${adults || 0}</p>
        <p><b>Дети:</b> ${children || 0}</p>
        <p><b>Багаж:</b> ${baggage ? "Да" : "Нет"}</p>
        <p><b>Комментарии:</b> ${comment || "не указано"}</p>
        <p><b>Согласие с условиями:</b> ${garant ? "Да" : "Нет"}</p>
        <p><b>Цена:</b> ${normPrice}€</p>
        
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
      totalPrice,
      tripPurpose,
      garant,
      locale = "fr", // Добавляем язык, по умолчанию "fr"
    } = req.body;

    // Генерируем уникальный ID для бронирования

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

    const newId = uuidv4();

    const booking = new Booking2({
      pickupLocation,
      duration,
      date,
      name,
      phone,
      email,
      tripPurpose,
      totalPrice,
      garant,
      locale,
      id: newId, // Генерируем уникальный ID, если не передан
      type: "form2",
    });
    const parisDate = moment(booking.date)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm");
    await booking.save();

    const normPrice = booking.totalPrice;

    //const confirmUrl = `https://backtest1-0501.onrender.com/api/bookings/confirm2/${booking._id}`;

    // Письмо админу
    const mailOptionsAdmin = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Новая заявка на бронирование (Почасовая аренда)",
      html: `
        <h2>Новая заявка на бронирование (Почасовая аренда)</h2>
        <p><b>Номер бронирования:</b> ${newId}</p>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Место подачи:</b> ${pickupLocation}</p>
        <p><b>Длительность:</b> ${duration} ч.</p>
        <p><b>Дата:</b> ${parisDate}</p>
        <p><b>Цель поездки:</b> ${tripPurpose || "не указано"}</p>
        <p><b>Цена:</b> ${normPrice}€</p>
        <p><b>Согласие с условиями:</b> ${garant ? "Да" : "Нет"}</p>
        
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
/*app.post("/api/admin/bookings/:id/confirm", isAdmin, async (req, res) => {
  try {
    const booking = await Booking1.findById(req.params.id);
    if (!booking) return res.status(404).send("Заявка не найдена");

    if (booking.confirmed) return res.send("Заявка уже подтверждена");

    booking.confirmed = true;
    await booking.save();

    // Устанавливаем язык i18next на нужный
    await i18next.changeLanguage(booking.locale || "fr");

    const parisDate = moment(booking.date)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm");

    const parisReturnDate = booking.returnDate
      ? moment(booking.returnDate).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
      : i18next.t("email.not_specified");

    await booking.save();

    const returnDateHtml = booking.returnDate
      ? `<p><b>${i18next.t("email.return_date")}:</b> ${
          parisReturnDate || i18next.t("email.not_specified")
        }</p>`
      : "";

    const mailOptionsClient = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: i18next.t("email.confirmed_subject"),
      html: `
        <h2>${i18next.t("email.thanks", { name: booking.name })}</h2>
        <p>${i18next.t("email.booking_confirmed_1")}</p>
        <p><b>${i18next.t("email.booking_number")}:</b> ${booking.id}</p>
        <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
        <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
        <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
        <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>
        ${returnDateHtml}
        <p><b>${i18next.t("email.from")}:</b> ${booking.from}</p>
        <p><b>${i18next.t("email.to")}:</b> ${booking.to}</p>
        <p><b>${i18next.t("email.adults")}:</b> ${booking.adults || 1}</p>
        <p><b>${i18next.t("email.children")}:</b> ${booking.children || 0}</p>
        <p><b>${i18next.t("email.luggage")}:</b> ${
        booking.baggage ? i18next.t("email.yes") : i18next.t("email.no")
      }</p>
        <p><b>${i18next.t("email.price")}:</b> <b>${booking.price}€</b></p>
        <p>${i18next.t("email.we_look_forward")}</p>
      `,
    };

    console.log("Sending confirmation email to client:", mailOptionsClient);
    await transporter.sendMail(mailOptionsClient);

    res.send("Бронирование успешно подтверждено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Подтверждение бронирования формы 2 ---
app.post("/api/admin/bookings/:id/confirm", isAdmin, async (req, res) => {
  try {
    const booking = await Booking2.findById(req.params.id);
    if (!booking) return res.status(404).send("Заявка не найдена");

    if (booking.confirmed) return res.send("Заявка уже подтверждена");

    booking.confirmed = true;
    await booking.save();

    // Устанавливаем язык i18next на нужный
    await i18next.changeLanguage(booking.locale || "fr");

    const parisDate = moment(booking.date)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm");

    const normPrice = booking.totalPrice;

    const mailOptionsClient = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: i18next.t("email.hourly_confirmed_subject"),
      html: `
    <h2>${i18next.t("email.thanks", { name: booking.name })}</h2>
    <p>${i18next.t("email.hourly_confirmed_message")}</p>
    <p><b>${i18next.t("email.booking_number")}:</b> ${booking.id}</p>
    <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
    <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
    <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
    <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>
    <p><b>${i18next.t("email.pickup_location")}:</b> ${
        booking.pickupLocation
      }</p>
    <p><b>${i18next.t("email.duration_hours")}:</b> ${
        booking.duration
      } ${i18next.t("email.hours_short")}</p>
    <p><b>${i18next.t("email.price")}:</b> ${normPrice}€</p>
    <p>${i18next.t("email.we_look_forward")}</p>
  `,
    };

    console.log("Sending confirmation email to client:", mailOptionsClient);
    await transporter.sendMail(mailOptionsClient);

    res.send("Бронирование успешно подтверждено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});*/

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Простая проверка на наличие обязательных полей
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Все поля обязательны." });
    }

    // Настройка письма
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // вы получите сообщение на этот адрес
      subject: "Новое сообщение с контактной формы",
      html: `
        <h2>Новое сообщение с контактной формы</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Сообщение:</b></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Сообщение успешно отправлено." });
  } catch (error) {
    console.error("Ошибка при отправке контактного письма:", error);
    res.status(500).json({ message: "Ошибка при отправке письма." });
  }
});

app.get("/ping", (req, res) => {
  res.status(200).send("I am alive!");
});

// Роуты
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Введите email и пароль" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Неверный логин или пароль" });
});


app.post("/api/admin/bookings/:id/confirm", isAdmin, async (req, res) => {
  try {
    const type = req.query.type || "standard";

    const bookingModel = type === "hourly" ? Booking2 : Booking1;
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) return res.status(404).send("Заявка не найдена");
    if (booking.confirmed) return res.send("Заявка уже подтверждена");

    booking.confirmed = true;
    await booking.save();

    await i18next.changeLanguage(booking.locale || "fr");

    const parisDate = moment(booking.date)
      .tz("Europe/Paris")
      .format("DD/MM/YYYY HH:mm");

    let emailContent;

    if (type === "hourly") {
      emailContent = {
        subject: i18next.t("email.hourly_confirmed_subject"),
        html: `
          <h2>${i18next.t("email.thanks", { name: booking.name })}</h2>
          <p>${i18next.t("email.hourly_confirmed_message")}</p>
          <p><b>${i18next.t("email.booking_number")}:</b> ${booking.id}</p>
          <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
          <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
          <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
          <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>
          <p><b>${i18next.t("email.pickup_location")}:</b> ${booking.pickupLocation}</p>
          <p><b>${i18next.t("email.duration_hours")}:</b> ${booking.duration} ${i18next.t("email.hours_short")}</p>
          <p><b>${i18next.t("email.price")}:</b> ${booking.totalPrice}€</p>
          <p>${i18next.t("email.we_look_forward")}</p>
        `,
      };
    } else {
      const parisReturnDate = booking.returnDate
        ? moment(booking.returnDate).tz("Europe/Paris").format("DD/MM/YYYY HH:mm")
        : i18next.t("email.not_specified");

      const returnDateHtml = booking.returnDate
        ? `<p><b>${i18next.t("email.return_date")}:</b> ${parisReturnDate}</p>`
        : "";

      emailContent = {
        subject: i18next.t("email.confirmed_subject"),
        html: `
          <h2>${i18next.t("email.thanks", { name: booking.name })}</h2>
          <p>${i18next.t("email.booking_confirmed_1")}</p>
          <p><b>${i18next.t("email.booking_number")}:</b> ${booking.id}</p>
          <p><b>${i18next.t("email.name")}:</b> ${booking.name}</p>
          <p><b>${i18next.t("email.phone")}:</b> ${booking.phone}</p>
          <p><b>${i18next.t("email.email")}:</b> ${booking.email}</p>
          <p><b>${i18next.t("email.date")}:</b> ${parisDate}</p>
          ${returnDateHtml}
          <p><b>${i18next.t("email.from")}:</b> ${booking.from}</p>
          <p><b>${i18next.t("email.to")}:</b> ${booking.to}</p>
          <p><b>${i18next.t("email.adults")}:</b> ${booking.adults || 1}</p>
          <p><b>${i18next.t("email.children")}:</b> ${booking.children || 0}</p>
          <p><b>${i18next.t("email.luggage")}:</b> ${
            booking.baggage ? i18next.t("email.yes") : i18next.t("email.no")
          }</p>
          <p><b>${i18next.t("email.price")}:</b> <b>${booking.price}€</b></p>
          <p>${i18next.t("email.we_look_forward")}</p>
        `,
      };
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.send("Бронирование успешно подтверждено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});




/*app.get("/api/admin/bookings", isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/


// Удалить бронирование
app.delete("/api/admin/bookings/:id", isAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
