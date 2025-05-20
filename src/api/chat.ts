import type { Request, Response } from "express";
import { HttpError, ErrorResponse, SuccessResponse } from "../utils/index.js";
import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
import User from "../model/user.js";
import Chat from "../model/chat.js";
import env from "../utils/env.js";

const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email } = await req.body;

    if (!name || !email) {
      throw new HttpError(400, "Name & Email are required!");
    }

    let existsUser = await User.findOneAndUpdate(
      { email },
      { name },
      { new: true }
    );

    if (!existsUser) {
      console.log(`User ${email} doesn't exists, registering them...!`);
      existsUser = await User.create({ name, email });
    }

    return SuccessResponse(
      res,
      201,
      "User registered successfully!",
      existsUser
    );
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    return ErrorResponse(
      res,
      error.code || 400,
      error.message || "Error while registering user to stream chat!"
    );
  }
};

const sendMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { message, uid } = await req.body;

    if (!message || !uid) {
      throw new HttpError(400, "Message and UserId are required!");
    }

    const existsUser = await User.exists({ _id: uid });

    if (!existsUser) {
      throw new HttpError(404, "User not found. Please register first!");
    }

    const chatHistory = await Chat.find({ uid: existsUser._id })
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
      model: env.GEMINI_AI_MODEL,
      contents: conversations,
    });

    const geminiReply = geminiResponse.text ?? "No response from Gemini!";

    const savedChat = await Chat.create({
      uid: uid,
      message: message,
      reply: geminiReply,
    });

    return SuccessResponse(
      res,
      200,
      "Gemini respond message successfully",
      savedChat
    );
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    return ErrorResponse(
      res,
      error.code || 400,
      error.message || "Error while getting response from Gemini!"
    );
  }
};

const getMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const { uid } = await req.body;

    if (!uid) {
      throw new HttpError(400, "UserId is required!");
    }

    const chatHistory = await Chat.find({ uid });

    return SuccessResponse(
      res,
      200,
      "Chat message fetched successfully!",
      chatHistory
    );
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    return ErrorResponse(
      res,
      error.code || 400,
      error.message || "Error while fetching chat message history!"
    );
  }
};

/** Adding controllers to chat routes */
const router = Router();

router.post("/register-user", registerUser);
router.post("/send-message", sendMessage);
router.post("/get-messages", getMessages);

export default router;
