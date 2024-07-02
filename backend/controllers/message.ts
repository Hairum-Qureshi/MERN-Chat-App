import { Request, Response } from "express";
import Message from "../models/chat-app/message";
import colors from "colors";
import Chat from "../models/chat-app/chat";

colors.enable();

const createMessage = async (req: Request, res: Response) => {
	const { sender, conversation_ID, content } = req.body;
	try {
		const createdMessage = await Message.create({
			sender,
			conversation_ID,
			content
		});

		await Chat.findByIdAndUpdate(
			{ _id: conversation_ID },
			{
				latestMessage: content
			}
		);

		const populatedMessage = await Message.findById(createdMessage._id)
			.populate({
				path: "sender",
				select: "_id profile_picture"
			})
			.select("-__v");

		res.status(201).send(populatedMessage);
	} catch (error) {
		console.log("Error".red.bold, error);
		res.status(500).json(error);
	}
};

const get_messages = async (req: Request, res: Response) => {
	try {
		const messages = await Message.find({
			conversation_ID: req.params.conversation_id
		})
			.populate({
				path: "sender",
				select: "_id profile_picture"
			})
			.select("-__v");
		res.status(200).send(messages);
	} catch (error) {
		console.log("Error".red.bold, error);
		res.status(500).json(error);
	}
};

export { createMessage, get_messages };
