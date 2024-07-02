import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const chatSchema = new Schema(
	{
		chatName: {
			type: String,
			trim: true
		},
		isGroupChat: {
			type: Boolean,
			default: false
		},
		members: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User"
		},
		latestMessage: {
			type: String,
			ref: "Message",
			default: ""
		} //,
		// admin: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "User"
		// }
	},
	{
		timestamps: true
	}
);

type Chat = InferSchemaType<typeof chatSchema>;
export default model<Chat>("Chat", chatSchema);
