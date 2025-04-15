const Doctor = require("../models/Doctor");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const { department, page = 1, limit = 10 } = req.query;

  const query = {};
  if (department) query.department = department;

  const doctors = await Doctor.find(query)
    .populate("user", "firstName lastName email photo")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Doctor.countDocuments(query);

  res.status(200).json({
    status: "success",
    results: doctors.length,
    totalPages: Math.ceil(total / limit),
    data: {
      doctors,
    },
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).populate(
    "user",
    "firstName lastName email photo"
  );

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.createDoctor = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  if (user.role !== "doctor") {
    return next(
      new AppError("Only users with doctor role can be added as doctors", 400)
    );
  }

  const doctorData = {
    user: req.user.id,
    ...req.body,
  };

  const doctor = await Doctor.create(doctorData);

  res.status(201).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.updateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.deleteDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
