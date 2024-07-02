import express from "express";
import { createMessage, get_messages } from "../controllers/message";

const router = express.Router();

// Prefix: "/api/messages"
router.post("/create", createMessage);

router.get("/:conversation_id", get_messages);

export default router;
