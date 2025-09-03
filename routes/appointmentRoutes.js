import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsBySpecialist,
} from "../controllers/appointmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: create appointment (patient)
// GET: get appointments (depending on role)
router.route("/")
  .post(protect, createAppointment)
  .get(protect, getAppointments);

// GET: single appointment by id
router.route("/:id")
  .get(protect, getAppointmentById);

  router.route("/specialist/:specialistId").get(protect, getAppointmentsBySpecialist);

// PATCH: update status (specialist or admin)
router.route("/:id/status")
  .patch(protect, updateAppointmentStatus);

// DELETE: cancel/delete appointment (patient or admin)
router.route("/:id")
  .delete(protect, deleteAppointment);

export default router;
