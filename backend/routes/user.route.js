import express from "express";
import {
  login,
  logout,
  register,
  updateProfile
} from "../controllers/user.controller.js";

import { requireAuth } from "../middlewares/isAuthenticated.js";
import { multiUpload } from "../middlewares/mutler.js";

const router = express.Router();

// ✅ Register & Login
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// ✅ Update profile (protected)
router.route("/profile/update").post(
  requireAuth,
  multiUpload,
  updateProfile
);

export default router;