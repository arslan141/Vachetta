import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI not defined. Database features will be limited.");
}

export const connectDB = async () => {
  if (!MONGODB_URI || MONGODB_URI.includes('your_mongodb_connection_string')) {
    console.warn("MongoDB not configured. Using mock data for development.");
    return Promise.resolve(true);
  }

  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    if (connection.readyState === 1) {
      console.log("MongoDB connected successfully");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.warn("Continuing with mock data...");
    return Promise.resolve(true); // Don't reject to allow development without DB
  }
};
