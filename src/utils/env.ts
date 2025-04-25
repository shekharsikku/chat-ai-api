import dotenv from "dotenv";
import { cleanEnv, str, url, num, port } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  MONGODB_URI: url(),
  OPENAI_API_KEY: str(),
  STREAM_API_KEY: str(),
  STREAM_API_SECRET: str(),

  PAYLOAD_LIMIT: str({ devDefault: "10mb" }),
  CORS_ORIGIN: str({ devDefault: "*" }),
  PORT: port({ devDefault: 4000 }),
  NODE_ENV: str({ choices: ["development", "production"] }),
});

export default env;
