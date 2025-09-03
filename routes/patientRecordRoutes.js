// routes/patientRecordRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createRecord,
  getRecordsByPatient,
  getRecordsForSpecialist,
} from "../controllers/patientRecordController.js";

const router = express.Router();

// Create record (specialist)
router.post("/", protect, authorize("specialist"), createRecord);

// Get records for specialist / admin
router.get("/", protect, authorize("specialist", "admin"), getRecordsForSpecialist);

// Get records by patientId (patient or specialist or admin)
router.get("/patient/:patientId", protect, getRecordsByPatient);

export default router;
