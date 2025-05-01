import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import morgan from "morgan";
import cors from "cors";
import env from "./utils/env";
import chat from "./api/chat";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: env.PAYLOAD_LIMIT,
    strict: true,
  })
);

app.use(
  express.urlencoded({
    limit: env.PAYLOAD_LIMIT,
    extended: true,
  })
);

if (env.isDev) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("tiny"));
}

app.use("/api/chat", chat);

app.all("*path", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Chat AI - Powered By GenAI" });
});

app.use(((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error!" });
}) as ErrorRequestHandler);

export default app;
