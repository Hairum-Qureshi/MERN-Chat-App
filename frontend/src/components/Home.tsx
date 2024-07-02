import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="font-semibold m-4">
			<h1 className="text-2xl hover:text-green-600 hover:cursor-pointer">
				<Link to="/sign-in">SIGN IN</Link>
			</h1>
			<h1 className="text-2xl hover:text-green-600 hover:cursor-pointer">
				<Link to="/sign-up">SIGN UP</Link>
			</h1>
		</div>
	);
}
