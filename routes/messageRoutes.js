const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/isAdmin");
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/login/admin", auth, messageController.getMessages);
router.post("/login/admin/:id/reply", auth, messageController.replyMessage);
router.delete("/login/admin/:id", auth, messageController.deleteMessage);

module.exports = router;
