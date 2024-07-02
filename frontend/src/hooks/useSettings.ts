import axios from "axios";
import { useState } from "react";

interface Tools {
	handleClick: (fileInputRef: React.RefObject<HTMLInputElement>) => void;
	handleImageChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		imageRef: React.RefObject<HTMLImageElement>
	) => void;
	enableNotifications: () => void;
	enabledMessageNotifications: boolean;
}

export default function useSettings(): Tools {
	const [enabledMessageNotifications, setEnabledMessageNotifications] =
		useState<boolean>(
			localStorage.getItem("enable-message-notifications") === "true"
		);

	const handleClick = (fileInputRef: React.RefObject<HTMLInputElement>) => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	function handleImageChange(
		event: React.ChangeEvent<HTMLInputElement>,
		imageRef: React.RefObject<HTMLImageElement>
	) {
		if (event.target.files && imageRef.current) {
			const imageFile: File = event.target.files[0];
			const formData = new FormData();
			formData.append("profile_picture", imageFile);

			axios
				.post("http://localhost:4000/api/auth/upload", formData, {
					withCredentials: true
				})
				.then(response => console.log(response))
				.catch(error => console.log(error));

			imageRef.current.src = window.URL.createObjectURL(event.target.files[0]);
		}
	}

	function enableNotifications() {
		const check_enabled: null | string = localStorage.getItem(
			"enable-message-notifications"
		);
		if (!check_enabled) {
			if (check_enabled === "true") {
				localStorage.setItem("enable-message-notifications", "false");
				setEnabledMessageNotifications(false);
			} else {
				Notification.requestPermission().then(perm => {
					if (perm === "granted") {
						localStorage.setItem("enable-message-notifications", "true");
						setEnabledMessageNotifications(true);
					}
				});
			}
		} else {
			if (check_enabled === "true") {
				localStorage.setItem("enable-message-notifications", "false");
				setEnabledMessageNotifications(false);
			} else {
				Notification.requestPermission().then(perm => {
					if (perm === "granted") {
						localStorage.setItem("enable-message-notifications", "true");
						setEnabledMessageNotifications(true);
					}
				});
			}
		}
	}

	return {
		handleClick,
		handleImageChange,
		enableNotifications,
		enabledMessageNotifications
	};
}
