import { connect } from "mongoose";
import env from "./utils/env.js";
import app from "./app.js";

const uri = env.MONGODB_URI;
const port = env.PORT;

(async () => {
  try {
    /** Connection state returned by mongoose. */
    const { connection } = await connect(uri);

    /** Checking connection state of mongodb. */
    if (connection.readyState === 1) {
      /** Database connection success log. */
      console.log("Database connection success!");

      /** Listening express/socket.io server */
      app.listen(port, () => {
        /** Server running information log. */
        console.log(`Server running on port: ${port}\n`);
      });
    } else {
      throw new Error("Database connection error!");
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
})();
