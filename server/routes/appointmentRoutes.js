const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

// User routes
router
  .route("/")
  .get(appointmentController.getUserAppointments)
  .post(appointmentController.createAppointment);

// Doctor routes
router.get("/doctor", appointmentController.getDoctorAppointments);
router.patch("/:id/status", appointmentController.updateAppointmentStatus);

module.exports = router;
