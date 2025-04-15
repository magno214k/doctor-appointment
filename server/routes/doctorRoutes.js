const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");
const appointmentController = require("../controllers/appointmentController");
const upload = require("../utils/fileUpload");

const router = express.Router();

// Public routes
router.route("/").get(doctorController.getAllDoctors);

router.route("/:id").get(doctorController.getDoctor);

// Doctor-specific protected routes
router.use(authController.protect, authController.restrictTo("doctor"));

router
  .route("/me/schedule")
  .get(doctorController.getMySchedule)
  .post(doctorController.setMyAvailability);

router.route("/me/appointments").get(appointmentController.getMyAppointments);

router
  .route("/me/appointments/:id")
  .patch(appointmentController.updateAppointmentStatus)
  .post(doctorController.createPrescription);

router
  .route("/me/profile")
  .patch(upload.single("photo"), doctorController.updateMyProfile);

// Admin-only routes
router.use(authController.restrictTo("admin"));

router.route("/").post(doctorController.createDoctor);

router.route("/:id/verify").patch(doctorController.verifyDoctor);

router
  .route("/:id")
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

module.exports = router;
