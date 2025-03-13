import mongoose, { Schema } from "mongoose";
import { TUser } from "./auth.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    profileImage: {
      type: String,
      default: "",
    },
    isBanned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<TUser>("User", UserSchema);

export default User;
