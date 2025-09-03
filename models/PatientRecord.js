import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diagnosis: String,
  prescription: String,
  treatmentPlan: String,
  visitDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("PatientRecord", patientRecordSchema);
