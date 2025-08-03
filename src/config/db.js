import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/bit-backend';
        console.log(`Connecting to database: ${mongoose.connection.name || 'connecting...'}`);
        await mongoose.connect(mongoURI);
        console.log("MongoDB conectado correctamente");
        console.log(`Database name: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("MongoDB conexión fallida | Error:", error.message);
        console.log("Asegúrese de que MongoDB se esté ejecutando y que MONGODB_ATLAS_URI esté configurado correctamente");
    }
}

export default connectDB;