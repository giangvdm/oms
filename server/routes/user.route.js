import express from "express";
import { 
  createUser, 
  getUsers, 
  updateUser, 
  loginUser, 
  changePassword, 
  deleteAccount 
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.put("/:id", protect, updateUser);
router.post("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;
