import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const messageSchema = new Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		conversation_ID: {
			type: String,
			ref: "Chat"
		},
		content: {
			type: String,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

type Message = InferSchemaType<typeof messageSchema>;
export default model<Message>("Message", messageSchema);
