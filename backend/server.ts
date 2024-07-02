import express from "express";
import dotenv from "dotenv";
import mongoose, { get } from "mongoose";
import colors from "colors";
import auth_routes from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import user_routes from "./routes/user";
import chat_routes from "./routes/chat";
import message_routes from "./routes/message";
import { Server } from "socket.io";

dotenv.config();
colors.enable();

const app = express();
const PORT: string | number = process.env.PORT! || 4000;
const MONGO_URI: string = process.env.MONGO_URI!;

const corsOptions = {
	origin: "http://localhost:5174",
	credentials: true,
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", auth_routes);
app.use("/api/users", user_routes);
app.use("/api/chats", chat_routes);
app.use("/api/messages", message_routes);

interface ActiveUsers {
	user_id: string;
	socket_id: string;
}

mongoose
	.connect(MONGO_URI)
	.then(() => {
		const express_server = app.listen(PORT, () => {
			console.log(
				`Successfully connected to MongoDB! Server listening on port ${PORT}`
					.magenta.underline.bold
			);
		});

		const io = new Server(express_server, {
			cors: {
				origin: ["http://localhost:5174"]
			}
		});

		let users: ActiveUsers[] = [];
		const addUser = (user_id: string, socket_id: string) => {
			if (
				user_id &&
				!users.some((user: ActiveUsers) => user.user_id === user_id)
			) {
				users.push({ user_id, socket_id });
			}
		};

		const removeUser = (socket_id: string) => {
			users = users.filter((user: ActiveUsers) => user.socket_id !== socket_id);
		};

		const getUser = (user_id: string) => {
			return users.find(
				(activeUser: ActiveUsers) => activeUser.user_id === user_id
			);
		};

		io.on("connection", socket => {
			console.log("A user connected!".green);

			// Handles adding any users that connect to the 'users' array
			socket.on("add-user", (user_id: string) => {
				addUser(user_id, socket.id);
				io.emit("active-users", users);
			});

			// Handles sending and getting messages
			socket.on(
				"send-message",
				({ _id, sender, receiver_id, conversation_ID, message }) => {
					const receiver_user: ActiveUsers = getUser(receiver_id)!; // find the receiver's data which includes their socket_id
					// once you have their socket ID, emit a custom event to them
					const sender_user: ActiveUsers = getUser(_id)!;
					if (receiver_user) {
						io.to(receiver_user.socket_id).emit("get-message", {
							_id,
							sender,
							conversation_ID,
							message
						});

						// Handles sending both the sender and receiver the recent message (if both are online)
						io.to(receiver_user.socket_id)
							.to(sender_user.socket_id)
							.emit("get-recent-message", {
								recent: message,
								chat_id: conversation_ID
							});
					}

					if (!receiver_user && sender_user) {
						// Handles sending only the sender the recent message (if the receiver is offline)
						io.to(sender_user.socket_id).emit("get-recent-message", {
							recent: message,
							chat_id: conversation_ID
						});
					}
				}
			);

			// Handles the typing indicator
			socket.on(
				"typing-indicator",
				({ typing_username, is_typing, receiver_id }) => {
					const user: ActiveUsers = getUser(receiver_id)!;
					if (user) {
						io.to(user.socket_id).emit("get-typing-status", {
							typing_username,
							is_typing
						});
					}
				}
			);

			// Handles removing any users that connect to the 'users' array
			socket.on("disconnect", () => {
				console.log("A user disconnected".red);
				removeUser(socket.id);
				io.emit("active-users", users);
			});
		});
	})
	.catch(err => {
		console.log(err.red.bold);
	});
