const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/admin", auth(["admin"]), messageController.getMessages);
router.post("/admin/:id/reply", auth(["admin"]), messageController.replyMessage);
router.delete("/admin/:id", auth(["admin"]), messageController.deleteMessage);

module.exports = router;
