import express from "express";
import { requireAuth } from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload} from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(requireAuth,registerCompany);
router.route("/get").get(requireAuth,getCompany);
router.route("/get/:id").get(requireAuth,getCompanyById);
router.route("/update/:id").put(requireAuth,singleUpload, updateCompany);

export default router;

