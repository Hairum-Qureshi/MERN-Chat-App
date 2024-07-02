import { Request, Response } from "express";
import User from "../models/user";
import { decodeSessionToken } from "./handle_auth";

const currentUser = async (req: Request, res: Response) => {
	const session_token: string = req.cookies["auth-session"];
	if (session_token) {
		const user_id: string = decodeSessionToken(session_token);
		// get all data except the password, createdAt, updatedAt, and __v:
		const user = await User.findById({ _id: user_id })
			.select("-password")
			.select("-createdAt")
			.select("-updatedAt")
			.select("-__v");
		res.status(200).json(user);
	} else {
		res.status(401).send("Unauthorized");
	}
};

export { currentUser };
