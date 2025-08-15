import mongoose from "mongoose";

// Definición del esquema para un juego
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del juego es requerido"],
    trim: true,
  },
  console: {
    type: String,
    required: [true, "La consola es requerida"],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "El género es requerido"],
    trim: true,
  },
  developer: {
    type: String,
    required: [true, "El desarrollador es requerido"],
    trim: true,
  },
  publisher: {
    type: String,
    required: [true, "El editor es requerido"],
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: [true, "El año de lanzamiento es requerido"],
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

const GameModel = mongoose.model("Game", gameSchema);
export default GameModel;
