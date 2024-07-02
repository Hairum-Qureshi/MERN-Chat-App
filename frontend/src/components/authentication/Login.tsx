// TODO - add a link redirecting the user to the register page if they don't have an account
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loginUser, loading } = useAuthentication();

	return (
		<div className="bg-white p-5">
			<h1 className="text-5xl font-semibold text-center lg:text-left">
				Welcome back!
			</h1>
			<p className="font-medium text-lg text-gray-500 mt-4 text-center lg:text-left">
				Welcome back to React Chat. Please enter your details to login and
				resume chatting. Don't have an account? Click&nbsp;
				<Link to="/sign-up" className="text-blue-600">
					here
				</Link>
				&nbsp;to create an account!
			</p>
			<div className="mt-8">
				<div>
					<label htmlFor="email" className="text-lg font-medium ml-2 lg:ml-0">
						Email
					</label>
					<input
						type="email"
						id="email"
						placeholder="Email"
						className="w-full border-2 border-gray-100 rounded-md mt-1 p-4 outline-gray-300"
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
			</div>
			<div>
				<div className="mt-3">
					<label
						htmlFor="password"
						className="text-lg font-medium ml-2 lg:ml-0"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						placeholder="Password"
						className="w-full border-2 border-gray-100 rounded-md mt-1 p-4 outline-gray-300"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
			</div>
			<div>
				<div className="flex">
					<input type="checkbox" id="remember-login" className="ml-3 lg:ml-0" />
					<label htmlFor="remember-login" className="ml-2">
						Remember Me
					</label>
					<button className="ml-auto text-purple-700 font-semibold mr-3 lg:mr-0">
						Forgot Password
					</button>
				</div>
			</div>
			<div className="w-full mt-6 text-center">
				<button
					className="text-xl m-auto border-2 py-2.5 rounded-md w-1/2 bg-blue-600 text-white"
					onClick={() => loginUser(email, password)}
				>
					{!loading ? "Login" : "Loading..."}
				</button>
			</div>
		</div>
	);
}
