import { Router } from "express";
import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";
import usersController from "../controllers/user.js";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Users endpoint works!" });
});

// Complete CRUD routes
userRouter.post("/", usersController.create);
userRouter.get("/all", usersController.readAll);
userRouter.get("/:id", usersController.readOne);
userRouter.put("/:id", usersController.update);
userRouter.delete("/:id", usersController.delete);

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("User found:", user.username);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user.username);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log("Password match successful for user:", user.username);
    
    // Verificar que JWT_SECRET esté configurado
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        username: user.username 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userData } = user.toObject();
    console.log("Login successful for user:", user.username);
    res.json({ 
      message: "Login successful", 
      token,
      user: userData 
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default userRouter;