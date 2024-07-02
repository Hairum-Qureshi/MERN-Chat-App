import { Request, Response } from "express";
import Chat from "../models/chat-app/chat";
import colors from "colors";
import { decodeSessionToken } from "./handle_auth";
import User from "../models/user";

colors.enable();

const create_chat = async (req: Request, res: Response) => {
	const { username } = req.body;
	const session_token: string = req.cookies["auth-session"];
	const user_id: string = decodeSessionToken(session_token);
	try {
		const receiver_data = await User.findOne({ username });
		const sender_data = await User.findById({ _id: user_id });
		if (receiver_data && sender_data) {
			if (username === sender_data.username) {
				res.status(400).json({ message: "You can't chat with yourself" });
			} else {
				// Checks if a chat between these two users exists. The '$all' operator checks if all specified elements are present in the array, regardless of their order, so this'll work even if the elements were the other way around
				const check_existing_chat = await Chat.findOne({
					members: {
						$all: [receiver_data._id, sender_data._id]
					}
				})
					.populate({
						path: "members", // select the property from the Chat model to populate with ref data (in this case from the User model)
						select: "-password -__v" // Exclude password and '__v' from each member document
					})
					.select("-__v");
				if (check_existing_chat) {
					res.status(200).json(check_existing_chat);
				} else {
					const new_conversation = await Chat.create({
						chat_name: "",
						creator: user_id,
						members: [sender_data._id, receiver_data._id]
					});

					const created_conversation = await Chat.findById({
						_id: new_conversation._id
					})
						.populate({
							path: "members", // select the property from the Chat model to populate with ref data (in this case from the User model)
							select: "-password -__v" // Exclude password and '__v' from each member document
						})
						.select("-__v");

					res.status(200).send(created_conversation);
				}
			}
		} else {
			res.status(400).send("User not found");
		}
	} catch (error) {
		console.log("Error from chat.ts".red.bold, error);
		res.status(500).send("Internal server error");
	}
};

const getUserChats = async (req: Request, res: Response) => {
	const { user_id } = req.params;
	try {
		if (!user_id) {
			res.status(400).send("Please provide a user ID");
		} else {
			// Returns conversations in which the user_id via URL is in the 'members' array
			const conversations = await Chat.find({
				members: {
					$in: [user_id]
				}
			})
				.populate({
					path: "members", // select the property from the Chat model to populate with user data
					select: "-password -__v" // Exclude password and '__v' from each member document
				})
				.select("-__v")
				.sort({ createdAt: -1 }); // sorts it so newest added contact goes on top

			res.status(200).send(conversations);
		}
	} catch (error) {
		console.log("Error from chat.ts".red.bold, error);
		res.status(500).send("Internal server error");
	}
};

export { create_chat, getUserChats };
