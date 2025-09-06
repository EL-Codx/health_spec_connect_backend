import express from "express";
import { getBookedSpecialists, getChatPartners, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/contacts", getBookedSpecialists);
router.get("/partners", getChatPartners); // ?userId=xxx&role=patient/specialist
router.get("/:chatRoom", getMessages);
router.post("/", sendMessage);

export default router;
