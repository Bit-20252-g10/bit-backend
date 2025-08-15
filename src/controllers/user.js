import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";

export const usersController = {
  create: async (req, res) => {
    try {
      console.log("Creating user with data:", req.body);
      const { username, email, password } = req.body;
      
      // Validations
      if (!username || !email || !password) {
        console.log("Validation failed - missing fields:", { username: !!username, email: !!email, password: !!password });
        return res.status(400).json({
          allOK: false,
          message: "All fields are required: username, email, password",
          data: null,
        });
      }

      // Check if email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.log("Email already exists:", email);
        return res.status(400).json({
          allOK: false,
          message: "Email already registered",
          data: null,
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new UserModel({ 
        username, 
        email, 
        password: hashedPassword 
      });
      
      const userCreated = await newUser.save();
      

      const { password: _, ...userData } = userCreated.toObject();
      
      console.log("User created successfully:", userData._id);
      res.status(201).json({
        allOK: true,
        message: "User created successfully",
        data: userData,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        allOK: false,
        message: "Error creating user",
        data: error.message,
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const users = await UserModel.find().select('-password');
      res.status(200).json({
        allOK: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving users",
        data: error.message,
      });
    }
  },

  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          allOK: false,
          message: "Invalid ID. Must be a valid MongoDB ObjectId",
          data: null,
        });
      }
      
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({
          allOK: false,
          message: `User with ID ${id} not found`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `User with ID ${id} found`,
        data: user,
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving user",
        data: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // If password is being updated, hash it
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }
      
      const updatedUser = await UserModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({
          allOK: false,
          message: `User with ID ${id} not found`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `User with ID ${id} updated successfully`,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        allOK: false,
        message: "Error updating user",
        data: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userDeleted = await UserModel.findByIdAndDelete(id);
      if (!userDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `User with ID ${id} not found`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `User with ID ${id} deleted successfully`,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        allOK: false,
        message: "Error deleting user",
        data: error.message,
      });
    }
  }
};

export default usersController;