import { Socket } from "socket.io-client";

export interface AuthContextProps {
	children: React.ReactNode;
}

export interface User {
	username: string;
	email: string;
	_id: string;
	date_joined: string;
	profile_picture: string;
}

export interface Contact {
	createdAt: string;
	isGroupChat?: boolean;
	members: User[];
	_id: string;
	latestMessage?: string;
	admin?: string;
}

export interface ContextData {
	userData: User | null;
	error: string | null;
	signOut: () => void;
}

export interface ActiveUsers {
	user_id: string;
	socket_id: string;
}

export interface ContactBlockProps {
	contact: Contact;
	activeUsers: ActiveUsers[];
	socket: React.RefObject<Socket>;
}

export interface Message {
	_id: string;
	sender: {
		_id: string;
		profile_picture: string;
	};
	conversation_ID: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
}

export interface TypingHandlers {
	typing_username: string;
	is_typing: boolean;
}

export interface MessageBody {
	_id: string;
	sender: {
		_id: string;
		profile_picture: string;
	};
	receiver_id: string;
	conversation_ID: string;
	message: string;
	createdAt: string;
}
