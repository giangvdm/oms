import express from "express";

import { createUser, getUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;
