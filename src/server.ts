import app from "./app";
import connectDatabase from "./config/db.config";
import userRoutes from "./routes/user.routes"
const PORT = 8080;
const DB_URI = "mongodb://localhost:27017/team_12";

//! connect database
connectDatabase(DB_URI);
//! users
app.use("/api/users", userRoutes);
//! 
//! listening on port
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
