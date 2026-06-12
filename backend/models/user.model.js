import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  location: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institute: String,
  degree: String,
  startYear: String,
  endYear: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phoneNumber: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true
  },

  profile: {
    bio: { type: String },

    skills: {
      type: [String],
      default: []
    },

    skillsSource: {
      type: String,
      enum: ["manual", "resume"],
      default: "manual"
    },

    resume: { type: String },
    resumeOriginalName: { type: String },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },

    profilePhoto: {
      type: String,
      default: ""
    },

    // ✅ NEW FIELDS
    age: { type: Number },
    location: { type: String },
    ctc: { type: String },
    experienceYears: { type: Number },
    notes: { type: String },

    experience: {
      type: [experienceSchema],
      default: []
    },

    education: {
      type: [educationSchema],
      default: []
    },

    certifications: {
      type: [String],
      default: []
    },

    achievements: {
      type: [String],
      default: []
    }
  }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);