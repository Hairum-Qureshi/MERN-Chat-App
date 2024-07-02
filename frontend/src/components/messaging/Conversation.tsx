import { useEffect, useRef, useState } from "react";
import useAuthContext from "../../contexts/authContext";
import {
	ActiveUsers,
	Contact,
	Message,
	TypingHandlers,
	User
} from "../../interfaces";
import MessageBubble from "./Message";
import useDMS from "../../hooks/useDMS";
import { Socket } from "socket.io-client";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";

interface Props {
	chatData: Contact;
	activeUsers: ActiveUsers[];
	socket: React.RefObject<Socket>;
}

export default function Conversation({ chatData, activeUsers, socket }: Props) {
	const { userData } = useAuthContext()!;
	const [receiver, setReceiver] = useState<User | null>();
	const [message, setMessage] = useState("");
	const { sendMessage, chatMessages } = useDMS(socket);
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const [typing, setTyping] = useState(false);
	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [typingIndicator, setTypingIndicator] = useState("");
	const [showGIFs, setShowGIFs] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);

	function enableTyping() {
		setTyping(true);

		socket.current &&
			socket.current.emit("typing-indicator", {
				typing_username: userData?.username,
				is_typing: true,
				receiver_id: receiver?._id
			});

		if (searchTimeout.current != null) clearTimeout(searchTimeout.current);
		searchTimeout.current = setTimeout(stopTypingIndicator, 1500);
	}

	function stopTypingIndicator() {
		setTyping(false);
		socket.current &&
			socket.current.emit("typing-indicator", {
				typing_username: userData?.username,
				is_typing: false,
				receiver_id: receiver?._id
			});
		setTypingIndicator("");
	}

	useEffect(() => {
		socket.current &&
			socket.current.on(
				"get-typing-status",
				({ typing_username, is_typing }: TypingHandlers) => {
					if (is_typing) {
						setTypingIndicator(`@${typing_username} is typing...`);
					} else {
						setTypingIndicator("");
					}
				}
			);
	}, [typing]);

	const chat_id: string | undefined = window.location.pathname.split("/").pop();

	useEffect(() => {
		setReceiver(
			chatData.members.filter(member => member._id !== userData?._id)[0]
		);
	}, [chat_id]);

	// Scroll to the bottom of the chat messages
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatMessages]);

	const getActivityStatus = (user_id: string): boolean => {
		return activeUsers.some(
			(activeUser: ActiveUsers) => activeUser.user_id === user_id
		);
	};

	return (
		<div className="h-screen flex flex-col">
			<div className="w-full border-b-2 border-b-black p-1 bg-slate-300 flex items-center sticky top-0">
				<img
					src={receiver?.profile_picture}
					alt={`${receiver?.username}'s Profile Picture`}
					className="w-10 h-10 rounded-full border border-black object-cover"
				/>
				<div className="flex items-center">
					{receiver && getActivityStatus(receiver._id) ? (
						<div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
					) : (
						<div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div>
					)}
				</div>
				<h1 className="ml-2">@{receiver?.username}</h1>
			</div>
			<div className="flex-1 overflow-y-auto p-2">
				{chatMessages.length > 0 &&
					chatMessages.map((message: Message) => (
						<MessageBubble
							you={message.sender._id === userData?._id}
							content={message.content}
							profile_picture={message.sender.profile_picture}
							sent_date={message.createdAt}
							key={message._id}
						/>
					))}
				<div ref={chatEndRef} />
				<div className="flex justify-end mt-2">
					{showGIFs && (
						<GifPicker
							tenorApiKey={"AIzaSyCmAwP7uq_wfPz5XjVQbSs1sMDyiE-XRtU"}
							onGifClick={TenorImage => {
								sendMessage(TenorImage.preview.url, receiver);
								setShowGIFs(false);
							}}
						/>
					)}
					{showEmojis && (
						<div>
							<EmojiPicker
								onEmojiClick={emojiData =>
									setMessage(`${message} ${emojiData.emoji}`)
								}
							/>
						</div>
					)}
				</div>
			</div>
			<h1 className="m-1 font-semibold">
				<i>{typingIndicator}</i>
			</h1>

			<div className="w-full flex items-center h-20 border-t-2 border-t-black p-2">
				<textarea
					className="w-full resize-none outline-none p-2 bg-gray-100 h-full"
					placeholder={`Send a message to @${receiver?.username}...`}
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyDown={e => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault(); // Prevents the default action (inserting a newline)
							setTyping(false);
							sendMessage(message, receiver);
							setMessage("");
							setShowEmojis(false);
						}
						enableTyping();
					}}
				></textarea>
				<button
					className="border-2 border-black rounded-md"
					onClick={() => setShowGIFs(!showGIFs)}
				>
					PRESS FOR GIFS
				</button>
				<button
					className="border-2 border-black rounded-md"
					onClick={() => setShowEmojis(!showEmojis)}
				>
					PRESS FOR EMOJIS
				</button>
			</div>
		</div>
	);
}
