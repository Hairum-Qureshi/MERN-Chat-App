import express from "express";
import { currentUser } from "../controllers/user";

const router = express.Router();

// Prefix: "/api/users"
router.get("/current", currentUser);

export default router;
