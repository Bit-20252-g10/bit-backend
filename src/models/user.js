import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

  },
  { versionKey: false, timestamps: true }
);

export default model("User", userSchema);
