import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";  // Adjust path

const router = express.Router();

// Add new user (Admin panel action)
router.post("/add", async (req, res) => {
  console.log(req.body)
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const password = Math.random().toString(36).slice(-8); // temp password

    const newUser = new User({
      name,
      email,
      role,
      // status,
      password
    });

    await newUser.save();
    res.json({ message: "User created successfully", password });
    alert(`Password: ${password}`)
  } catch (err) {
    console.error("Error in /api/users/add:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["admin", "support"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// Get all specialists
router.get("/specialists", async (req, res) => {
  try {
    const users = await User.find({ role: "specialist" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// Get all patients
router.get("/patients", async (req, res) => {
  try {
    const users = await User.find({ role: "patient" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", details: error.message });
  }
});


// Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body; // removed status

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
});



export default router;