import express from "express";
import { searchMedia, getMediaDetails, getSearchHistory, deleteSearch } from "../controllers/search.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", searchMedia);
router.get("/details/:id", getMediaDetails);

// Protected routes (authentication required)
router.get("/history", protect, getSearchHistory);
router.delete("/history/:id", protect, deleteSearch);

export default router;