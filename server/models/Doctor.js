const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    required: [true, "Please select department"],
    enum: [
      "Cardiology",
      "Dermatology",
      "Pediatrics",
      "Neurology",
      "Orthopedics",
      "General Physician",
    ],
  },
  qualification: {
    type: String,
    required: [true, "Please enter qualification"],
  },
  experience: {
    type: Number,
    required: [true, "Please enter experience in years"],
  },
  registrationNumber: {
    type: String,
    required: [true, "Please enter registration number"],
  },
  fee: {
    type: Number,
    required: [true, "Please enter consultation fee"],
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
  },
  city: {
    type: String,
    required: [true, "Please enter city"],
  },
  state: {
    type: String,
    required: [true, "Please enter state"],
  },
  postalCode: {
    type: String,
    required: [true, "Please enter postal code"],
  },
  availableDays: {
    type: [String],
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  timeSlots: {
    type: [String],
    required: true,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
