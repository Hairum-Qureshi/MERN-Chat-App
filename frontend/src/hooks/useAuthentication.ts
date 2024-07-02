import { useState } from "react";
import axios from "axios";

interface AuthTools {
	registerUser: (username: string, email: string, password: string) => void;
	loginUser: (email: string, password: string) => void;
	loading: boolean;
}

export default function useAuthentication(): AuthTools {
	const [loading, isLoading] = useState(false);

	function registerUser(username: string, email: string, password: string) {
		isLoading(true);
		axios
			.post(
				"http://localhost:4000/api/auth/sign-up",
				{
					username,
					email,
					password
				},
				{
					withCredentials: true
				}
			)
			.then(response => {
				if (response.status === 200) {
					window.location.href = "/conversations";
					isLoading(false);
				}
			})
			.catch(error => {
				console.log(error);
				isLoading(false);
			});
	}

	function loginUser(email: string, password: string) {
		isLoading(true);
		axios
			.post(
				"http://localhost:4000/api/auth/sign-in",
				{
					email,
					password
				},
				{
					withCredentials: true
				}
			)
			.then(response => {
				if (response.status === 200) {
					window.location.href = "/conversations";
					isLoading(false);
				}
			})
			.catch(error => {
				console.log(error);
				isLoading(false);
			});
	}

	return { registerUser, loginUser, loading };
}
