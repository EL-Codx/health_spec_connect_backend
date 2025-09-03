// controllers/messageController.js
import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * Send message
 * POST /api/messages
 * body: { receiverId, content }
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) return res.status(400).json({ message: "receiverId and content required" });

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    const msg = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get conversation between current user and another user
 * GET /api/messages/conversation/:userId
 */
export const getConversation = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const msgs = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherId },
        { sender: otherId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Mark messages as read (messages sent to current user from other user)
 * PATCH /api/messages/read/:userId
 */
export const markAsRead = async (req, res) => {
  try {
    const otherId = req.params.userId;
    await Message.updateMany({ sender: otherId, receiver: req.user._id, read: false }, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
