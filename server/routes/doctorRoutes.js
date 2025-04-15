const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");

const router = express.Router();

// Public routes
router.route("/").get(doctorController.getAllDoctors);

router.route("/:id").get(doctorController.getDoctor);

// Protected routes (admin only)
router.use(authController.protect, authController.restrictTo("admin"));

router.route("/").post(doctorController.createDoctor);

router
  .route("/:id")
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

module.exports = router;
