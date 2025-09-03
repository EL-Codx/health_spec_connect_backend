// routes/messageRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getConversation, markAsRead } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/conversation/:userId", protect, getConversation);
router.patch("/read/:userId", protect, markAsRead);

export default router;
