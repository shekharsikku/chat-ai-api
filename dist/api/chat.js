"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const express_1 = require("express");
const utils_1 = require("../utils");
const user_1 = __importDefault(require("../model/user"));
const chat_1 = __importDefault(require("../model/chat"));
const env_1 = __importDefault(require("../utils/env"));
const genAI = new genai_1.GoogleGenAI({ apiKey: env_1.default.GEMINI_API_KEY });
const registerUser = async (req, res) => {
    try {
        const { name, email } = await req.body;
        if (!name || !email) {
            throw new utils_1.ApiError(400, "Name & Email are required!");
        }
        let existsUser = await user_1.default.findOneAndUpdate({ email }, { name }, { new: true });
        if (!existsUser) {
            console.log(`User ${email} doesn't exists, registering them...!`);
            existsUser = await user_1.default.create({ name, email });
        }
        return (0, utils_1.ApiResponse)(res, 201, "User registered successfully!", existsUser);
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        return (0, utils_1.ApiResponse)(res, error.code || 400, error.message || "Error while registering user to stream chat!");
    }
};
const sendMessage = async (req, res) => {
    try {
        const { message, uid } = await req.body;
        if (!message || !uid) {
            throw new utils_1.ApiError(400, "Message and UserId are required!");
        }
        const existsUser = await user_1.default.findById(uid);
        if (!existsUser) {
            throw new utils_1.ApiError(404, "User not found. Please register first!");
        }
        const chatHistory = await chat_1.default.find({ uid: existsUser._id })
            .sort({ createdAt: 1 })
            .limit(10);
        const conversations = chatHistory.flatMap((chat) => {
            return [
                { role: "user", parts: [{ text: chat.message }] },
                { role: "model", parts: [{ text: chat.reply }] },
            ];
        });
        conversations.push({ role: "user", parts: [{ text: message }] });
        const geminiResponse = await genAI.models.generateContent({
            model: env_1.default.GEMINI_AI_MODEL,
            contents: conversations,
        });
        const geminiReply = geminiResponse.text ?? "No response from Gemini!";
        const savedChat = await chat_1.default.create({
            uid: uid,
            message: message,
            reply: geminiReply,
        });
        return (0, utils_1.ApiResponse)(res, 200, "Gemini respond message successfully", savedChat);
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        return (0, utils_1.ApiResponse)(res, error.code || 400, error.message || "Error while getting response from Gemini!");
    }
};
const getMessages = async (req, res) => {
    try {
        const { uid } = await req.body;
        if (!uid) {
            throw new utils_1.ApiError(400, "UserId is required!");
        }
        const chatHistory = await chat_1.default.find({ uid });
        return (0, utils_1.ApiResponse)(res, 200, "Chat message fetched successfully!", chatHistory);
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        return (0, utils_1.ApiResponse)(res, error.code || 400, error.message || "Error while fetching chat message history!");
    }
};
const router = (0, express_1.Router)();
router.post("/register-user", registerUser);
router.post("/send-message", sendMessage);
router.post("/get-messages", getMessages);
exports.default = router;
