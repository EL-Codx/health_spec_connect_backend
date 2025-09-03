import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { registerUser, loginUser } from "../controllers/authController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Specialist & Patient registration
router.post("/register", upload.single("image"), registerUser);

// Login route
router.post("/login", loginUser);


export default router;