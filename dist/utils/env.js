"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
dotenv_1.default.config();
const env = (0, envalid_1.cleanEnv)(process.env, {
    MONGODB_URI: (0, envalid_1.url)(),
    GEMINI_API_KEY: (0, envalid_1.str)(),
    GEMINI_AI_MODEL: (0, envalid_1.str)(),
    REDIRECT_ORIGIN: (0, envalid_1.str)(),
    PAYLOAD_LIMIT: (0, envalid_1.str)({ devDefault: "10mb" }),
    CORS_ORIGIN: (0, envalid_1.str)({ devDefault: "*" }),
    PORT: (0, envalid_1.port)({ devDefault: 4000 }),
    NODE_ENV: (0, envalid_1.str)({ choices: ["development", "production"] }),
});
exports.default = env;
