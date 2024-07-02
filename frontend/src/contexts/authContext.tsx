import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { User, ContextData, AuthContextProps } from "../interfaces";

export const AuthContext = createContext<ContextData | null>(null);

export const AuthProvider = ({ children }: AuthContextProps) => {
	const [userData, setUserData] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getCurrUserData = async () => {
			try {
				const userDataResponse = await axios.get(
					"http://localhost:4000/api/users/current",
					{
						withCredentials: true
					}
				);
				if (userDataResponse.data.message === "Unauthorized") {
					setUserData(null);
				} else {
					setUserData(userDataResponse.data);
				}
			} catch (error) {
				console.error("There was an error", error);
				setError("Failed to fetch user data.");
			}
		};

		getCurrUserData();
	}, []);

	const signOut = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/api/auth/sign-out",
				{
					withCredentials: true
				}
			);
			if (response.status === 200) {
				setUserData(null);
				window.location.href = "/";
			}
		} catch (error) {
			console.error("There was an error during sign out", error);
			setError("Failed to sign out.");
		}
	};

	const value: ContextData = {
		userData,
		error,
		signOut
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
	return useContext(AuthContext);
};

export default useAuthContext;
