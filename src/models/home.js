import { Schema, model } from "mongoose";

const homeSchema = new Schema(
  {
    heroTitle: {
      type: String,
      required: true,
      default: "Bienvenido a Princegaming"
    },
    heroSubtitle: {
      type: String,
      required: true,
      default: "Tu tienda de confianza para consolas, juegos y accesorios gaming"
    },
    heroButtonText: {
      type: String,
      required: true,
      default: "Explorar Consolas"
    },
    heroButtonRoute: {
      type: String,
      required: true,
      default: "/consolas"
    },
    heroBackgroundImage: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { versionKey: false, timestamps: true }
);

export default model("Home", homeSchema); 