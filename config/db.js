const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB подключена успешно");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
