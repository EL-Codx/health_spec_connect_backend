import Appointment from "../models/Appointment.js";

// Create new appointment
export const createAppointment = async (req, res) => {
  console.log(req.body)
  const { specialist, patient, date, time, reason } = req.body;

  // received_data = req.body

  // console.log()

  // console.log(`

  //   Patient: ${patient}
  //   Specialist: ${specialist}
  //   Date: ${date}
  //   Time: ${time}
  //   Reason: ${reason}
  //   `
  // )

  try {
    // const { patientId, specialistId, date, time, reason } = req.body;

    const newAppointment = new Appointment({
      patient: patient,
      specialist: specialist,
      date: date,
      time: time,
      reason: reason,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

// Get all appointments with patient & specialist names
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")     // only return name & email
      .populate("specialist", "name email"); // only return name & email

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("specialist", "name email");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("patient", "name email")
      .populate("specialist", "name email");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};


// Get all appointments for a particular specialist
export const getAppointmentsBySpecialist = async (req, res) => {
  try {
    const { specialistId } = req.params;

    const appointments = await Appointment.find({ specialist: specialistId })
      .populate("patient", "name email")     // show patient info
      .populate("specialist", "name email"); // also show specialist info

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this specialist" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching specialist appointments", error });
  }
};
