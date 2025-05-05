// Update server/routes/search.route.js
import express from "express";
import { searchMedia, getMediaDetails, getSearchHistory, deleteSearch, clearSearchHistory } from "../controllers/search.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// Semi-public routes (works for both authenticated and unauthenticated users)
router.get("/", optionalAuth, searchMedia);
router.get("/details/:id", optionalAuth, getMediaDetails);

// Protected routes (authentication required)
router.get("/history", protect, getSearchHistory);
router.delete("/history/:id", protect, deleteSearch);
router.delete("/history", protect, clearSearchHistory);

export default router;