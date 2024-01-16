import express from "express";
const router = express.Router();
import { sendMessage, getMessages, getGroupMessages } from "../controllers/messageControllers.js";
import { Auth } from "../middleware/user.js";
router.post("/", Auth, sendMessage);
router.get("/:chatId", Auth, getMessages);
router.get("/groupmessages/:chatId", Auth, getGroupMessages);
export default router;
