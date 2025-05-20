import { connect } from "mongoose";
import env from "./utils/env.js";
import app from "./app.js";
const uri = env.MONGODB_URI;
const port = env.PORT;
(async () => {
    try {
        const { connection } = await connect(uri);
        if (connection.readyState === 1) {
            console.log("Database connection success!");
            app.listen(port, () => {
                console.log(`Server running on port: ${port}\n`);
            });
        }
        else {
            throw new Error("Database connection error!");
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}\n`);
        process.exit(1);
    }
})();
