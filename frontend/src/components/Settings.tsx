import { useRef, useState } from "react";
import useSettings from "../hooks/useSettings";
import useAuthContext from "../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const { userData, signOut } = useAuthContext()!;

	const {
		handleClick,
		handleImageChange,
		updatePassword,
		enableNotifications,
		enabledMessageNotifications
	} = useSettings();

	return (
		<div className="p-2">
			<h1 className="text-2xl font-semibold text-center">Settings</h1>
			<div className="flex items-center">
				<h1 className="text-xl">Hi, @{userData?.username}</h1>
				<div className="ml-auto flex items-center">
					{!enabledMessageNotifications ? (
						<FontAwesomeIcon
							icon={faBellSlash}
							className="text-xl mr-2 border-2 border-green-700 p-1 rounded-full text-green-500 bg-green-100 hover:cursor-pointer"
							onClick={enableNotifications}
						/>
					) : (
						<FontAwesomeIcon
							icon={faBell}
							className="text-xl mr-2 border-2 border-yellow-600 p-1 rounded-full text-yellow-500 bg-red-100 hover:cursor-pointer"
							onClick={enableNotifications}
						/>
					)}
					<button
						className="border border-green-700 bg-green-500 text-white rounded-md p-1"
						onClick={() => {
							signOut();
						}}
					>
						SIGN OUT
					</button>
				</div>
			</div>
			<div
				className="mt-1 w-full flex items-center justify-center"
				onClick={() => handleClick(fileInputRef)}
			>
				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					className="hidden"
					onChange={event => handleImageChange(event, imageRef)}
				/>
				<img
					src={
						userData?.profile_picture ||
						"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
					}
					alt="User profile picture"
					className="w-28 h-28 rounded-full border-2 border-black object-cover hover:cursor-pointer"
					ref={imageRef}
				/>
			</div>
			<div>
				<p className="text-sm text-gray-500 text-center">
					Click image to change your profile picture
				</p>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					id="username"
					placeholder="Username"
					className="w-full border border-black p-2 text-md outline-none rounded-md"
					disabled={true}
					value={`@${userData?.username}`}
				/>
			</div>
			<div className="mt-2">
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					placeholder="Email"
					className="w-full border border-black p-2 text-md outline-none rounded-md"
					disabled={true}
					value={userData?.email.toLowerCase()}
				/>
			</div>

			<div className="absolute bottom-12 mr-2">
				<h2 className="text-lg font-semibold">Danger Zone</h2>
				<p className="text-gray-500 text-justify">
					Deleting your account is irreversible and will result in you losing
					all of your data.
				</p>
				<button className="w-full p-2 border-2 border-red-700 rounded-md mt-3 bg-red-500 text-white">
					Delete Account
				</button>
			</div>
		</div>
	);
}
