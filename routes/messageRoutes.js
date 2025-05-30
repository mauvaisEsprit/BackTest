const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/admin", auth, messageController.getMessages);
router.post("/admin/:id/reply", auth, messageController.replyMessage);
router.delete("/admin/:id", auth, messageController.deleteMessage);

module.exports = router;
