import { config } from "dotenv";
import { cleanEnv, str, url, port } from "envalid";
const result = config();
if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}
const env = cleanEnv(result.parsed, {
    MONGODB_URI: url(),
    GEMINI_API_KEY: str(),
    GEMINI_AI_MODEL: str(),
    REDIRECT_ORIGIN: url(),
    PAYLOAD_LIMIT: str({ default: "100kb" }),
    CORS_ORIGIN: str({ default: "*" }),
    PORT: port({ default: 4000 }),
    NODE_ENV: str({
        choices: ["development", "production"],
        default: "development",
    }),
});
export default env;
