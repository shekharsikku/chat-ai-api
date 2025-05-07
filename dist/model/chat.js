import { Schema, model } from "mongoose";
const ChatSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Chat = model("Chat", ChatSchema);
export default Chat;
