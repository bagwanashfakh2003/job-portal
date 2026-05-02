import express from "express";
import { requireAuth } from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob,updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(requireAuth, postJob);
router.route("/get").get( getAllJobs);
router.route("/admin").get(requireAuth, getAdminJobs);
router.route("/get/:id").get( requireAuth, getJobById);
router.route("/update/:id").put(requireAuth, updateJob);

export default router;

