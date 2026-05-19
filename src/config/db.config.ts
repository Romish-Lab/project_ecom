import mongoose from "mongoose";

const connectDatabase = async (DB_URI: string) => {
  try {
    if (!DB_URI) {
      throw new Error("DB_URI is undefined");
    }

    await mongoose.connect(DB_URI);

    console.log("Database connected");
  } catch (error) {
    console.log("----------Database connection error---------");
    console.log(error);
    process.exit(1);
  }
};

export default connectDatabase;
