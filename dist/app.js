import { SuccessResponse, ErrorResponse, HttpError } from "./utils/index.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import env from "./utils/env.js";
import chat from "./api/chat.js";
const app = express();
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({
    limit: env.PAYLOAD_LIMIT,
    strict: true,
}));
app.use(express.urlencoded({
    limit: env.PAYLOAD_LIMIT,
    extended: true,
}));
if (env.isDev) {
    app.use(morgan("dev"));
}
else {
    app.use(morgan("tiny"));
}
app.use("/api/chat", chat);
app.all("*path", (_req, res) => {
    if (env.isDev) {
        return SuccessResponse(res, 200, "Chat AI - Powered By GenAI");
    }
    else {
        res.status(307).redirect(env.REDIRECT_ORIGIN);
    }
});
app.use(((err, _req, res, next) => {
    if (res.headersSent)
        return next(err);
    if (err instanceof HttpError) {
        return ErrorResponse(res, err.code || 500, err.message || "Internal server error!");
    }
    const fallback = env.isProd
        ? "Something went wrong!"
        : "Unknown error occurred!";
    const message = err.message || fallback;
    console.error(`Error: ${message}`);
    return ErrorResponse(res, 500, message);
}));
export default app;
