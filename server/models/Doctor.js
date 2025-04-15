const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true
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
      "Dentistry",
      "Ophthalmology",
      "Gynecology",
      "Psychiatry"
    ],
  },
  qualification: {
    type: String,
    required: [true, "Please enter qualification"],
  },
  experience: {
    type: Number,
    required: [true, "Please enter experience in years"],
    min: [0, "Experience cannot be negative"]
  },
  registrationNumber: {
    type: String,
    required: [true, "Please enter registration number"],
    unique: true
  },
  fee: {
    type: Number,
    required: [true, "Please enter consultation fee"],
    min: [0, "Fee cannot be negative"]
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
    validate: {
      validator: function(v) {
        return /^[0-9]{6}$/.test(v); // Basic Indian postal code validation
      },
      message: props => `${props.value} is not a valid postal code!`
    }
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
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "At least one available day is required"
    }
  },
  timeSlots: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "At least one time slot is required"
    }
  },
  remarks: {
    type: String,
    maxlength: [500, "Remarks cannot exceed 500 characters"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    documentType: {
      type: String,
      enum: ["license", "degree", "id_proof", "other"]
    },
    fileUrl: String,
    uploadedAt: Date
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"]
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp on save
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for upcoming appointments
doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: 'user',
  foreignField: 'doctor',
  options: { 
    sort: { date: 1 },
    match: { status: { $in: ['confirmed', 'pending'] } }
});

// Virtual for doctor's full name (from User model)
doctorSchema.virtual('fullName').get(function() {
  return this.user?.firstName + ' ' + this.user?.lastName;
});

// Indexes for better query performance
doctorSchema.index({ department: 1 });
doctorSchema.index({ isVerified: 1 });
doctorSchema.index({ city: 1, state: 1 });

// Query helper for active doctors
doctorSchema.query.active = function() {
  return this.where({ isVerified: true });
};

module.exports = mongoose.model("Doctor", doctorSchema);