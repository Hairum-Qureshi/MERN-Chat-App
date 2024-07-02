import express from "express";
import { create_chat, getUserChats } from "../controllers/chat";

const router = express.Router();

// Prefix: "/api/chats"
router.post("/create-chat", create_chat);

router.get("/:user_id", getUserChats);

export default router;
