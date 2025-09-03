import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "support", "specialist", "patient"], 
    default: "patient", 
    required: true 
  },
 
  // Specialist fields
  licenseNumber: { type: String },
  specialization: { type: String },
  image: { type: String },
  approved: { type: Boolean, default: false }, // Admin approves specialists

  // For patients only
  age: Number,
  gender: String,
  contact: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
