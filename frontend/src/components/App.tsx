import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import Authentication from "./authentication/Authentication";
import Chat from "./messaging/Chat";
import { AuthProvider } from "../contexts/authContext";

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/sign-up" element={<Authentication />} />
					<Route path="/sign-in" element={<Authentication />} />
					<Route path="/conversations" element={<Chat />} />
					<Route path="/conversations/:chat_id" element={<Chat />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}
