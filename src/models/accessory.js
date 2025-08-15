import mongoose from "mongoose";

// Definición del esquema para un accesorio
const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del accesorio es requerido"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "La marca es requerida"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "El tipo de accesorio es requerido"],
    trim: true,
  },
  console: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const AccessoryModel = mongoose.model("Accessory", accessorySchema);
export default AccessoryModel;
