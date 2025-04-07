import express from "express";

import { createUser, getUsers, updateUser, loginUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.post("/login", loginUser);

export default router;
