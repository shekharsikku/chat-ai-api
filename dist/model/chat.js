"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const Chat = (0, mongoose_1.model)("Chat", ChatSchema);
exports.default = Chat;
