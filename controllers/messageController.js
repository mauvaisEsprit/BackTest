const Message = require("../models/message");
const { sendReplyToClientEmail } = require("../utils/mailerContact");

// ➕ Получить все сообщения (админка)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении сообщений" });
  }
};

// ➕ Создать сообщение (с фронта)
exports.createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при отправке сообщения" });
  }
};

// ✅ Ответить на сообщение
exports.replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    const message = await Message.findByIdAndUpdate(id, { replied: true }, { new: true });

    if (!message) return res.status(404).json({ error: "Сообщение не найдено" });

    await sendReplyToClientEmail(
      message,
    );

    message.replied = true;
    await message.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при отправке ответа" });
  }
};

// ❌ Удалить сообщение
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Сообщение не найдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при удалении сообщения" });
  }
};
