import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/bit-backend";
        await mongoose.connect(mongoURI);
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("MongoDB conexión fallida | Error:", error.message);
    }
}

export default connectDB;