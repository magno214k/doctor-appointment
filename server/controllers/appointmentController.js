const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createAppointment = catchAsync(async (req, res, next) => {
  const { doctor, date, timeSlot, reason } = req.body;

  // Check if doctor exists
  const doctorDoc = await Doctor.findById(doctor);
  if (!doctorDoc) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  // Check if time slot is available
  const existingAppointment = await Appointment.findOne({
    doctor,
    date,
    timeSlot,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingAppointment) {
    return next(new AppError("This time slot is already booked", 400));
  }

  const appointment = await Appointment.create({
    user: req.user.id,
    doctor,
    date,
    timeSlot,
    reason,
  });

  res.status(201).json({
    status: "success",
    data: {
      appointment,
    },
  });
});

exports.getUserAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ user: req.user.id })
    .populate("doctor", "department fee")
    .populate("doctor.user", "firstName lastName photo");

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getDoctorAppointments = catchAsync(async (req, res, next) => {
  // Check if user is a doctor
  const doctor = await Doctor.findOne({ user: req.user.id });
  if (!doctor) {
    return next(
      new AppError("You are not authorized to view these appointments", 403)
    );
  }

  const appointments = await Appointment.find({ doctor: doctor._id }).populate(
    "user",
    "firstName lastName photo"
  );

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  });
});
