import express from "express";
import {
  uploadMedicalRecord,
  getMedicalHistory,
  getPrescriptions,
} from "../controllers/patientController";
import { verifyUser } from "../middlewares/auth";
import upload from "../utils/fileUpload";

const router = express.Router();

router.use(verifyUser);

router.post("/records", upload.single("file"), uploadMedicalRecord);
router.get("/records", getMedicalHistory);
router.get("/prescriptions", getPrescriptions);

export default router;
