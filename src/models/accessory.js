import { Schema, model } from "mongoose";

const accessorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Controles', 'Audífonos', 'Cargadores', 'Almacenamiento', 'Cables', 'Fundas', 'Otros']
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
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
    compatibleWith: [{
      type: String,
      enum: ['PlayStation', 'Xbox', 'Nintendo', 'Universal']
    }],
    color: {
      type: String,
      default: 'Negro'
    },
    wireless: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false, timestamps: true }
);

export default model("Accessory", accessorySchema); 