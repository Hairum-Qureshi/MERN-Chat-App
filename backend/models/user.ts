import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			trim: true,
			required: true
		},
		date_joined: {
			type: String
		},
		email: {
			type: String,
			unique: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		},
		profile_picture: {
			type: String,
			default:
				"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
		}
	},
	{
		timestamps: true
	}
);

type User = InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema);
