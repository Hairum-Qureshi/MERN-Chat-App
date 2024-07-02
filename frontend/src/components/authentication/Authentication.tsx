import { useLocation } from "react-router-dom";
import Registration from "./Registration";
import Login from "./Login";
import NotFound from "../NotFound";

export default function Authentication() {
	const location = useLocation();

	return (
		<div className="flex w-full h-screen">
			<div className="w-full flex items-center justify-center lg:w-1/2">
				{location.pathname.includes("/sign-up") ? (
					<Registration />
				) : location.pathname.includes("/sign-in") ? (
					<Login />
				) : (
					<NotFound />
				)}
			</div>
			<div className="bg-gray-200 hidden lg:flex h-full items-center w-1/2 justify-center">
				<div className="w-60 h-60 bg-gradient-to-tr from-blue-500 to-blue-200 rounded-full"></div>
			</div>
		</div>
	);
}
