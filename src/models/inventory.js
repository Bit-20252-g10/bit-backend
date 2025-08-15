import mongoose from "mongoose";

// Definición del esquema para un producto de inventario
const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del producto es requerido"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "El tipo de producto es requerido"],
    enum: ["consoles", "accessories", "games"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [0, "El precio no puede ser negativo"],
  },
  stock: {
    type: Number,
    required: [true, "El stock es requerido"],
    min: [0, "El stock no puede ser negativo"],
    default: 0,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: "https://placehold.co/400x300/e9ecef/212529?text=Sin+Imagen",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Campos específicos para juegos
  consola: {
    type: String,
    trim: true,
  },
  genero: {
    type: String,
    trim: true,
  },
  developer: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  releaseYear: {
    type: Number,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  multiplayer: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const InventoryModel = mongoose.model("Inventory", inventorySchema);
export default InventoryModel;