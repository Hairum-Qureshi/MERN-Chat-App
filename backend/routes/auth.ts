import express from "express";
import {
	sign_in,
	sign_out,
	sign_up,
	upload_user_image,
	delete_account
} from "../controllers/handle_auth";
import upload from "../uploading";

const router = express.Router();

// Prefix: "/api/auth"
router.post("/sign-up", sign_up);
router.post("/sign-in", sign_in);
router.post("/upload", upload.single("profile_picture"), upload_user_image);
router.get("/sign-out", sign_out);
router.delete("/delete-account", delete_account);

export default router;
