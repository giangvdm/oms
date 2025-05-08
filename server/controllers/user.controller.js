import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Search from "../models/search.model.js";

export const getUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.log("Error in fetching users:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createUser = async (req, res) => {
	const { name, email, password } = req.body;

	// Check required fields
	if (!name || !email || !password) {
		return res.status(400).json({ success: false, message: "Please provide all required fields!" });
	}

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists. Please provide a different email address.' });
		}
	
		// Create and save user
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, passwordHash: hashedPassword });
		await user.save();
	
		res.status(201).json({ success: true, message: 'User registered successfully', data: user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: err });
	}
};

export const updateUser = async (req, res) => {
	const { id } = req.params;

	const user = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid User Id" });
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
		res.status(200).json({ success: true, data: updatedUser });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const loginUser = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  
    // Include token in the user object
    res.status(200).json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: "There are problems trying to log you in. Please try again!" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Check if all required fields are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user's password
    user.passwordHash = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete user's search history
    await Search.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};