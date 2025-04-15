const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

// Existing methods remain the same until here...

exports.getMySchedule = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const query = {
    doctor: req.user.id,
    status: { $in: ["confirmed", "pending"] },
  };

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "firstName lastName photo")
    .sort("date timeSlot");

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.setMyAvailability = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user.id },
    { availableSlots: req.body.slots },
    { new: true, runValidators: true }
  );

  if (!doctor) {
    return next(new AppError("No doctor profile found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      availableSlots: doctor.availableSlots,
    },
  });
});

exports.createPrescription = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404));
  }

  if (appointment.doctor.toString() !== req.user.id) {
    return next(
      new AppError("You can only prescribe for your own appointments", 403)
    );
  }

  const prescription = await Prescription.create({
    doctor: req.user.id,
    patient: appointment.patient,
    appointment: appointment._id,
    medications: req.body.medications,
    instructions: req.body.instructions,
  });

  // Update appointment with prescription
  appointment.prescription = prescription._id;
  await appointment.save();

  res.status(201).json({
    status: "success",
    data: {
      prescription,
    },
  });
});

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const updateData = {
    ...req.body,
    updatedAt: Date.now(),
  };

  if (req.file) {
    updateData.photo = `/uploads/doctors/${req.file.filename}`;
  }

  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user.id },
    updateData,
    { new: true, runValidators: true }
  ).populate("user", "firstName lastName email photo");

  if (!doctor) {
    return next(new AppError("No doctor profile found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.verifyDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      isVerified: true,
      verifiedAt: Date.now(),
      verifiedBy: req.user.id,
    },
    { new: true, runValidators: true }
  ).populate("user", "firstName lastName email photo");

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  // Update user role if not already a doctor
  await User.findByIdAndUpdate(doctor.user, { role: "doctor" });

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.getDoctorStats = catchAsync(async (req, res, next) => {
  const stats = await Appointment.aggregate([
    {
      $match: { doctor: req.user._id },
    },
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        earnings: { $sum: "$fee" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats: stats[0] || {
        totalAppointments: 0,
        completed: 0,
        cancelled: 0,
        earnings: 0,
      },
    },
  });
});
