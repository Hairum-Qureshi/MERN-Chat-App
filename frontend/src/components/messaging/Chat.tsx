import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import Settings from "../Settings";
import ContactBlock from "./ContactBlock";
import useDMS from "../../hooks/useDMS";
import { ActiveUsers, Contact } from "../../interfaces";
import Conversation from "./Conversation";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import useAuthContext from "../../contexts/authContext";

const socket_io = io("http://localhost:4000", { autoConnect: false });

export default function Chat() {
	const [settingsMode, setSettingsMode] = useState(false);
	const [searchedUser, setSearchedUser] = useState("");
	const [chatSelected, setChatSelected] = useState(true);
	const [chatData, setChatData] = useState<Contact>();
	const socket = useRef<Socket>(socket_io);
	const [activeUsers, setActiveUsers] = useState<ActiveUsers[]>([]);
	const { userData } = useAuthContext()!;

	const { searchUser, userContacts } = useDMS();

	useEffect(() => {
		// Connect the socket
		socket.current.connect();

		// Listen for the 'connect' event to log the socket ID
		socket.current.on("connect", () => {
			// setSocket(socket_io);
		});

		// Cleanup function to disconnect the socket when the component unmounts
		return () => {
			socket.current.disconnect();
		};
	}, []);

	useEffect(() => {
		socket.current.emit("add-user", userData?._id);

		socket.current.on("active-users", (users: ActiveUsers[]) =>
			setActiveUsers(users)
		);
	}, [userData]);

	const navigate = useNavigate();

	const chat_id: string | undefined = window.location.pathname.split("/").pop();

	// This logic makes sure that if the URL has a chat's ID, it opens to that chat ID
	useEffect(() => {
		if (chat_id && userContacts) {
			setChatSelected(false);
			const found_chat: Contact[] | undefined = userContacts.filter(
				(contact: Contact) => contact._id === chat_id
			);
			setChatData(found_chat[0]);
		}
	}, [chat_id, userContacts]);

	return (
		<div className="border-2 border-black h-screen inline-flex w-full">
			<div className="w-1/4 h-screen overflow-auto relative">
				{!settingsMode ? (
					<>
						<input
							type="search"
							placeholder="Search Username"
							className="w-full outline-none p-2 bg-slate-200"
							value={searchedUser}
							onChange={e => setSearchedUser(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter") {
									searchUser(searchedUser);
									setSearchedUser("");
								}
							}}
						/>
						{userContacts.length > 0 ? (
							userContacts.map((contact: Contact) => {
								return (
									<div
										onClick={() => {
											navigate(`/conversations/${contact._id}`, {
												replace: true
											});

											setChatSelected(false);
											setChatData(contact);
										}}
										key={contact._id}
									>
										<ContactBlock
											contact={contact}
											key={contact._id}
											activeUsers={activeUsers}
											socket={socket}
										/>
									</div>
								);
							})
						) : (
							<h1 className="text-center text-lg font-semibold mt-4 p-3">
								You currently don't have any contacts with anyone. Search for a
								username to add a contact.
							</h1>
						)}
					</>
				) : (
					<Settings />
				)}
				<div
					className={`${
						!settingsMode && "border-t-2 border-black"
					} absolute w-full bottom-0 p-2 hover:cursor-pointer bg-white`}
				>
					{!settingsMode ? (
						<FontAwesomeIcon
							icon={faBars}
							className="text-2xl"
							onClick={() => setSettingsMode(!settingsMode)}
						/>
					) : (
						<FontAwesomeIcon
							icon={faX}
							className="text-2xl"
							onClick={() => setSettingsMode(!settingsMode)}
						/>
					)}
				</div>
			</div>
			<div
				className={`w-3/4 border-l border-l-black ${
					chatSelected ? "overflow-hidden" : "overflow-auto"
				}`}
			>
				{chatSelected || !chatData ? (
					<>
						<div className="flex items-center justify-center h-screen">
							<h1 className="text-3xl font-semibold">
								Select a conversation to begin chatting
							</h1>
						</div>
					</>
				) : (
					<Conversation
						chatData={chatData}
						activeUsers={activeUsers}
						socket={socket}
					/>
				)}
			</div>
		</div>
	);
}
