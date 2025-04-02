import mongoose from "mongoose";
import User from "../models/user.model.js";

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
		const user = new User({ name, email, passwordHash: password });
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
