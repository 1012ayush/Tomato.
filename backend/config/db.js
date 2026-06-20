import mongoose from "mongoose";

export const connectDB = async () => {
    // This tells the code to look at the Render Dashboard for the secure URL!
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error(" CRITICAL ERROR: MONGO_URI is missing. Check your Render Environment Variables.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("DB Connected Successfully! ");
    } catch (error) {
        console.error(" Database connection failed:", error.message);
        process.exit(1);
    }
}
