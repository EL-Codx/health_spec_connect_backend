// controllers/patientRecordController.js
import PatientRecord from "../models/PatientRecord.js";
import User from "../models/User.js";

/**
 * Create a patient record (specialist)
 * POST /api/records
 * body: { patientId, diagnosis, prescription, treatmentPlan, visitDate }
 */
export const createRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, treatmentPlan, visitDate } = req.body;
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") return res.status(400).json({ message: "Invalid patient" });

    const record = await PatientRecord.create({
      patient: patientId,
      specialist: req.user._id,
      diagnosis,
      prescription,
      treatmentPlan,
      visitDate: visitDate || Date.now(),
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get records by patient (patient can view own, specialist or admin can view)
 * GET /api/records/patient/:patientId
 */
export const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // ensure permissions
    if (req.user.role === "patient" && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // specialists and admin may view
    const records = await PatientRecord.find({ patient: patientId })
      .populate("specialist", "name email")
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Specialist: get records for their patients (or all if admin)
 * GET /api/records
 */
export const getRecordsForSpecialist = async (req, res) => {
  try {
    if (req.user.role === "specialist") {
      const records = await PatientRecord.find({ specialist: req.user._id })
        .populate("patient", "name email")
        .sort({ visitDate: -1 });
      return res.json(records);
    } else if (req.user.role === "admin") {
      const records = await PatientRecord.find()
        .populate("patient", "name email")
        .populate("specialist", "name email")
        .sort({ visitDate: -1 });
      return res.json(records);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
