import express from "express";
import { requireAuth } from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(requireAuth, applyJob);
router.route("/get").get(requireAuth, getAppliedJobs);
router.route("/:id/applicants").get(requireAuth, getApplicants);
router.route("/status/:id/update").post(requireAuth, updateStatus);
 

export default router;

