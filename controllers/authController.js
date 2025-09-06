import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// Register
export const registerUser = async (req, res) => {
  // console.log(req.body)
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "specialist") {
      userData.licenseNumber = req.body.licenseNumber;
      userData.specialization = req.body.specialization;
      userData.experienceYears = req.body.experienceYears;
      
      if (req.file) {
        userData.image = req.file.path;
      }

      // console.log(`Specialist: ${userData}`)
    }

    if (role === "patient"){
      userData.age = req.body.age;
      userData.gender = req.body.gender;
      userData.contact = req.body.contact;
    }

    const user = await User.create(userData);
    // console.log(`Registered: ${user}`)

    res.status(201).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      contact: user.contact,
      role: user.role,
      licenseNumber: user.licenseNumber,
      specialization: user.specialization,
      experienceYears: user.experienceYears,
      image: user.image,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      contact: user.contact,
      role: user.role,
      licenseNumber: user.licenseNumber,
      specialization: user.specialization,
      experienceYears: user.experienceYears,
      image: user.image,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};