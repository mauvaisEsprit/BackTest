const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/login/admin", auth(["admin"]), messageController.getMessages);
router.post("/login/admin/:id/reply", auth(["admin"]), messageController.replyMessage);
router.delete("/login/admin/:id", auth(["admin"]), messageController.deleteMessage);

module.exports = router;
