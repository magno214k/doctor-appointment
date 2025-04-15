import express from "express";
import { getStats, verifyDoctor } from "../controllers/adminController";
import { verifyAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/stats", verifyAdmin, getStats);
router.patch("/verify-doctor/:id", verifyAdmin, verifyDoctor);

export default router;
