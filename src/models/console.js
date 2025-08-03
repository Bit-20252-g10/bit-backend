import { Schema, model } from "mongoose";

const consoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      enum: ['PlayStation', 'Xbox', 'Nintendo', 'Otros']
    },
    model: {
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
    features: [{
      type: String
    }],
    releaseYear: {
      type: Number,
    },
    color: {
      type: String,
      default: 'Negro'
    }
  },
  { versionKey: false, timestamps: true }
);

export default model("Console", consoleSchema); 