import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";

const MONGODB_URI = "mongodb+srv://jhramirez9716:Nl0OhikItZJKWrE8@cluster0.ysotlnp.mongodb.net/db_games?retryWrites=true&w=majority&appName=Cluster0";

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const hash = await bcrypt.hash("Demo123", 10);
    const email = "pruebas@demo.com";
    // Elimina si ya existe
    await UserModel.deleteOne({ email });
    // Crea el usuario
    const user = new UserModel({
      username: "Usuario de Prueba",
      email,
      password: hash
    });
    await user.save();
    console.log("Usuario de prueba creado correctamente: pruebas@demo.com / Demo123");
    process.exit(0);
  } catch (error) {
    console.error("Error creando el usuario de prueba:", error);
    process.exit(1);
  }
};

run(); 