"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./utils/env"));
const chat_1 = __importDefault(require("./api/chat"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.default.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({
    limit: env_1.default.PAYLOAD_LIMIT,
    strict: true,
}));
app.use(express_1.default.urlencoded({
    limit: env_1.default.PAYLOAD_LIMIT,
    extended: true,
}));
if (env_1.default.isDev) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("tiny"));
}
app.use("/api/chat", chat_1.default);
app.all("*path", (_req, res) => {
    res.status(200).json({ message: "Chat AI - Powered By GenAI" });
});
app.use(((err, _req, res, _next) => {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
}));
exports.default = app;
