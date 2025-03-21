import mongoose from "mongoose";
import { logger } from "../utils/logger";

const connectDB = async (url: string): Promise<typeof mongoose> => {
  try {
    const connection = await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB connected: ${connection.connection.host}`);

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error", error);
    });

    return connection;
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
    throw error;
  }
};

export default connectDB;
