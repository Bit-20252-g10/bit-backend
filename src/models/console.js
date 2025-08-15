import mongoose from "mongoose";

// Definición del esquema para una consola
const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre de la consola es requerido"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "La marca es requerida"],
    trim: true,
  },
  generation: {
    type: String,
    trim: true,
  },
  releaseYear: {
    type: Number,
  },
  storage: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
  }
});

// Crear el modelo basado en el esquema
const Console = mongoose.model("Console", consoleSchema);

export default Console;
