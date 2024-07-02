import { useState, useEffect } from "react";
import axios from "axios";
import useAuthContext from "../contexts/authContext";
import { Contact, Message, MessageBody, User } from "../interfaces";
import { Socket } from "socket.io-client";
import useSettings from "./useSettings";

interface Tools {
	searchUser: (username: string) => void;
	userContacts: Contact[];
	sendMessage: (message: string, receiver: User) => void;
	chatMessages: Message[];
}

export default function useDMS(socket?: React.RefObject<Socket>): Tools {
	const [userContacts, setUserContacts] = useState<Contact[]>([]);
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const { enabledMessageNotifications } = useSettings();
	const { userData } = useAuthContext()!;

	const chat_id: string | undefined = window.location.href.split("/").pop();

	useEffect(() => {
		socket?.current &&
			socket.current.on("get-message", (message_data: MessageBody) => {
				const newMessage: Message = {
					_id: message_data._id,
					sender: message_data.sender,
					conversation_ID: message_data.conversation_ID,
					content: message_data.message,
					createdAt: new Date().toISOString()
				};

				setChatMessages(prev => [...prev, newMessage]);

				const current_users: Contact | undefined = userContacts.find(
					(chat: Contact) => {
						return chat._id === chat_id ? chat : null;
					}
				);

				if (newMessage.sender._id !== userData?._id) {
					const senderUsername = current_users?.members
						.filter((user: User) => user._id !== userData?._id)
						.map((user: User) => user.username)
						.join(", ");

					if (enabledMessageNotifications) {
						new Notification(`@${senderUsername} just sent you a message!`, {
							body: newMessage.content,
							icon: newMessage.sender.profile_picture
						});
					}
				}
			});

		return () => socket?.current && socket?.current.off("get-message"); // without this, you'll get duplicate messages
	}, [chatMessages]);

	useEffect(() => {
		const getContacts = async () => {
			try {
				if (userData?._id) {
					const response = await axios.get(
						`http://localhost:4000/api/chats/${userData._id}`
					);
					setUserContacts(response.data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getContacts();
	}, [userData?._id]);

	useEffect(() => {
		const getChatMessages = async () => {
			try {
				if (chat_id) {
					const response = await axios.get(
						`http://localhost:4000/api/messages/${chat_id}`
					);
					setChatMessages(response.data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getChatMessages();
	}, [chat_id]);

	async function searchUser(username: string) {
		if (!username) {
			alert("Please enter a username");
		} else {
			try {
				const response = await axios.post(
					"http://localhost:4000/api/chats/create-chat",
					{
						username
					},
					{
						withCredentials: true
					}
				);
				if (
					!userContacts.some(
						(contact: Contact) => contact._id === response.data._id
					)
				) {
					setUserContacts(prev => [response.data, ...prev]);
				} else {
					alert("You already have a conversation with this user");
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function sendMessage(message: string, receiver: User) {
		if (!message) {
			alert("Please enter a message");
		} else {
			try {
				if (socket?.current) {
					socket.current.emit("send-message", {
						_id: userData?._id,
						sender: {
							_id: userData?._id,
							profile_picture: userData?.profile_picture
						},
						receiver_id: receiver?._id,
						conversation_ID: chat_id,
						message
					});
				}

				const response = await axios.post(
					"http://localhost:4000/api/messages/create",
					{
						sender: userData?._id,
						conversation_ID: chat_id,
						content: message
					},
					{
						withCredentials: true
					}
				);
				setChatMessages(prev => [...prev, response.data]);
			} catch (error) {
				console.log(error);
			}
		}
	}

	return { searchUser, userContacts, sendMessage, chatMessages };
}
