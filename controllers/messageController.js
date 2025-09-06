import Appointment from "../models/Appointment.js";
import Message from "../models/Message.js";

// Get chat partners based on logged in user type
export const getChatPartners = async (req, res) => {
  try {
    const { userId, role } = req.query; // role = 'patient' or 'specialist'

    let partners = [];
    if (role === "patient") {
      // all specialists this patient booked
      const appointments = await Appointment.find({ patient: userId }).populate("specialist", "name email");
      partners = appointments.map(a => a.specialist);
    } else if (role === "specialist") {
      // all patients who booked this specialist
      const appointments = await Appointment.find({ specialist: userId }).populate("patient", "name email");
      partners = appointments.map(a => a.patient);
    }

    // remove duplicates
    const uniquePartners = partners.filter((p, i, self) => p && self.findIndex(x => x._id.equals(p._id)) === i);

    res.json(uniquePartners);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat partners", error: err });
  }
};

// Get old messages
export const getMessages = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    const messages = await Message.find({ chatRoom }).populate("sender", "name").sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    const chatRoom = [sender, receiver].sort().join("-"); // consistent order

    const message = new Message({ sender, receiver, chatRoom, text });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
};


// Fetch all specialists the logged-in patient has booked
export const getBookedSpecialists = async (req, res) => {

  try {
    const userId = req.query.userId; // patient userId
    console.log(req.query)

    // Find all appointments for this patient
    const appointments = await Appointment.find({ patient: userId }).populate("specialist", "name email specialization");
    console.log(appointments)

    // Extract unique specialists
    const specialists = appointments
      .map(app => app.specialist)
      .filter((spec, i, arr) => spec && arr.findIndex(x => x._id.equals(spec._id)) === i);

    res.json(specialists);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booked specialists", error: err.message });
  }
};