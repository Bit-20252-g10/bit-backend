import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";

const MONGODB_URI = "mongodb+srv://jhramirez9716:Nl0OhikItZJKWrE8@cluster0.ysotlnp.mongodb.net/db_games?retryWrites=true&w=majority&appName=Cluster0";

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const hash = await bcrypt.hash("Demo123", 10);
    const result = await UserModel.updateOne(
      { email: "pruebas@demo.com" },
      { $set: { password: hash } }
    );
    if (result.modifiedCount > 0) {
      console.log("Contraseña actualizada y encriptada correctamente.");
    } else {
      console.log("No se encontró el usuario o la contraseña ya estaba encriptada.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error actualizando la contraseña:", error);
    process.exit(1);
  }
};

run(); 