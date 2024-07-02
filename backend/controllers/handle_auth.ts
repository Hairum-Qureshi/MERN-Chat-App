import { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import colors from "colors";
import User from "../models/user";
import validator from "email-validator";
import usernameValidator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
colors.enable();

function createCookie(user_id: mongoose.Types.ObjectId, res: Response) {
	const payload = {
		user_id
	};
	const secretKey: string = Math.floor(
		Math.random() * Number(new Date())
	).toString();
	const token = jwt.sign(payload, secretKey, { expiresIn: "3d" });
	res.cookie("auth-session", token, { httpOnly: true, maxAge: 259200000 }); // 3 days in milliseconds
}

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const sign_up = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		const valid_emailCharacters: boolean = emailRegex.test(email);
		const foundUsername = await User.findOne({ username });
		const foundEmail = await User.findOne({ email });

		if (!foundUsername) {
			if (foundEmail) {
				res.status(409).send("Email already registered");
			} else {
				if (valid_emailCharacters) {
					const isValidEmail: boolean = validator.validate(email);
					if (isValidEmail) {
						if (!usernameValidator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
							res.status(400).send("Invalid username characters");
						} else {
							const hashedPassword: string = await bcrypt.hash(password, 10);

							const user = await User.create({
								username,
								date_joined: new Date().toLocaleDateString("en-US"),
								email,
								password: hashedPassword
							});

							createCookie(user._id, res);
							res.status(200).send("Successfully registered!");
						}
					}
				} else {
					res.status(400).send("Invalid email address");
				}
			}
		} else {
			res.status(400).send("Username taken");
		}
	} catch (error) {
		console.log((error as Error).toString().red.bold);
	}
};

const sign_in = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const valid_emailCharacters: boolean = emailRegex.test(email);
	const foundEmail = await User.findOne({ email });

	try {
		if (!valid_emailCharacters) {
			res.status(400).send("Invalid email address");
		} else {
			const isValidEmail: boolean = validator.validate(email);
			if (isValidEmail) {
				if (foundEmail) {
					const isValidPassword: boolean = await bcrypt.compare(
						password,
						foundEmail.password
					);
					if (isValidPassword) {
						createCookie(foundEmail._id, res);
						res.status(200).send("Success!");
					} else {
						res.status(400).send("Incorrect password");
					}
				}
			} else {
				res.status(400).send("Invalid email address");
			}
		}
	} catch (error) {
		console.log((error as Error).toString().red.bold);
	}
};

export function decodeSessionToken(session_token: string): string {
	const payloadBase64 = session_token.split(".")[1];
	const payloadBuffer = Buffer.from(payloadBase64, "base64");
	const payload = JSON.parse(payloadBuffer.toString());
	const current_uid: string = payload.user_id;
	return current_uid;
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const FOLDER_PATH = path.join(__dirname, "..", "./temp_images");

const upload_user_image = async (req: Request, res: Response) => {
	const token: string = req.cookies["auth-session"];
	const curr_uid: string = decodeSessionToken(token);

	fs.readdir(FOLDER_PATH, (err, files) => {
		files.forEach(async file => {
			const uploadedImagePath = path.resolve(
				__dirname,
				`../temp_images/${file}`
			);

			const uploadResult = await cloudinary.uploader
				.upload(uploadedImagePath, {
					public_id: `${curr_uid}-profile_picture`
				})
				.catch(error => {
					console.log(error);
				});

			if (uploadResult?.url) {
				fs.unlink(path.join(FOLDER_PATH, file), err => {
					if (err) throw err;
				});

				await User.findByIdAndUpdate(
					{ _id: curr_uid },
					{
						profile_picture: uploadResult?.url
					}
				);
			}
		});
	});
};

const sign_out = async (req: Request, res: Response) => {
	try {
		res.clearCookie("auth-session");
		res.status(200).send("Success");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error destroying session");
	}
};

const delete_account = async (req: Request, res: Response) => {
	// TODO :
	// When the user deletes their account, make sure their Cloudinary PFP is also deleted
	const session_token: string = req.cookies["auth-session"];
	const curr_user: string = decodeSessionToken(session_token);
	cloudinary.uploader
		.destroy(`${curr_user}-profile_picture`)
		.then(result => console.log(result));
};

export { sign_in, sign_out, sign_up, upload_user_image, delete_account };
