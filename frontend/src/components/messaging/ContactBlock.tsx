import { useEffect, useState } from "react";
import useAuthContext from "../../contexts/authContext";
import {
	ActiveUsers,
	ContactBlockProps,
	TypingHandlers,
	User
} from "../../interfaces";

interface Test {
	recent: string;
	chat_id: string;
}

export default function ContactBlock({
	contact,
	activeUsers,
	socket
}: ContactBlockProps) {
	const [typingIndicator, setTypingIndicator] = useState("");
	const [latestMessageData, setLatestMessageData] = useState<Test>();

	const { userData } = useAuthContext()!;

	const getActivityStatus = (user: User): boolean => {
		return activeUsers.some(
			(activeUser: ActiveUsers) => activeUser.user_id === user._id
		);
	};

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
	}, []);

	useEffect(() => {
		socket.current &&
			socket.current.on("get-recent-message", ({ recent, chat_id }: Test) => {
				if (recent) {
					setLatestMessageData({ recent, chat_id });
				}
			});
	}, []);

	return (
		<>
			{contact.members.map(
				(user: User) =>
					user._id !== userData?._id && (
						<div
							key={user._id}
							className="w-full border border-black rounded-md p-2 my-3 flex items-center bg-gray-100 hover:cursor-pointer active:bg-gray-200"
						>
							<div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
								<img
									src={user.profile_picture}
									alt="User Profile Picture"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="ml-2 flex-grow">
								<h1 className="font-semibold">@{user.username}</h1>
								<p className="text-sm text-gray-400">
									{typingIndicator.includes(user.username) ? (
										<p className="text-green-600">{typingIndicator}</p>
									) : latestMessageData &&
									  latestMessageData.chat_id === contact._id ? (
										<i>
											{latestMessageData.recent.length >= 35
												? latestMessageData.recent.substring(0, 35) + "..."
												: latestMessageData.recent}
										</i>
									) : contact.latestMessage ? (
										contact.latestMessage.length >= 35 ? (
											<i>{contact.latestMessage.substring(0, 35) + "..."}</i>
										) : (
											<i>{contact.latestMessage}</i>
										)
									) : (
										"No messages sent"
									)}
								</p>
							</div>
							<div className="inline-flex items-center">
								{getActivityStatus(user) ? (
									<div className="w-3 h-3 rounded-full bg-green-500 items-center justify-center mr-3"></div>
								) : (
									<div className="w-3 h-3 rounded-full bg-red-500 items-center justify-center mr-3"></div>
								)}
							</div>
						</div>
					)
			)}
		</>
	);
}
