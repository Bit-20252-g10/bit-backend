import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    consola: {
      type: String,
      required: true,
      enum: ['PlayStation', 'Xbox', 'Nintendo']
    },
    genero: {
      type: String,
      required: true,
      enum: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras', 'Shooter', 'Plataformas', 'Puzzle', 'Otros']
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    developer: {
      type: String,
      default: 'Desconocido'
    },
    publisher: {
      type: String,
      default: 'Desconocido'
    },
    releaseYear: {
      type: Number,
    },
    rating: {
      type: String,
      enum: ['E', 'E10+', 'T', 'M', 'AO'],
      default: 'E'
    },
    multiplayer: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false, timestamps: true }
);

export default model("Game", gameSchema);
