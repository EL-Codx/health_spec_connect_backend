import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  specialist: { type: mongoose.Schema.Types.ObjectId, ref: "Specialist", required: true },
  date: String,
  time: String,
  reason: String,
  status: { type: String, default: "pending", required: false },
  image: { type: String, default: "https://via.placeholder.com/120" } // fallback
});

export default mongoose.model("Appointment", appointmentSchema);

