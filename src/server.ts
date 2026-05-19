import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDatabase from "./config/db.config";
import ENV_CONFIG from "./config/env.config";

//! debug check (optional)
console.log("DB_URI:", process.env.DB_URI);
console.log("PORT:", process.env.PORT);

const DB_URI = ENV_CONFIG.db_uri;
const PORT = ENV_CONFIG.port;

//! connect database
connectDatabase(DB_URI);

//! start server
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
