import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // patient or specialist
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    chatRoom: {
      type: String, // could be patientId-specialistId
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
