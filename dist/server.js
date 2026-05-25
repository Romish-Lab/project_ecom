"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_config_1 = __importDefault(require("./config/db.config"));
const env_config_1 = __importDefault(require("./config/env.config"));
//! debug check (optional)
// console.log("DB_URI:", process.env.DB_URI);
// console.log("PORT:", process.env.PORT);
const DB_URI = env_config_1.default.db_uri;
const PORT = env_config_1.default.port;
//! connect database
(0, db_config_1.default)(DB_URI);
//! start server
app_1.default.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
