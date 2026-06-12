import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

import { extractSkills } from "../utils/extractSkills.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ DEFAULT AVATAR
    const DEFAULT_AVATAR =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: DEFAULT_AVATAR,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
  fullname,
  email,
  phoneNumber,
  bio,
  skills,
  age,
  location,
  ctc,
  experienceYears,
  notes,
  experience,
  education
} = req.body;

    const profilePhotoFile = req.files?.profilePhoto?.[0];
    const resumeFile = req.files?.resume?.[0];

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

   // ===== NEW PROFILE FIELDS =====
if (age) user.profile.age = age;
if (location) user.profile.location = location;
if (ctc) user.profile.ctc = ctc;
if (experienceYears) user.profile.experienceYears = experienceYears;
if (notes) user.profile.notes = notes;

// Arrays (handle JSON or direct array)
if (experience) {
  try {
    user.profile.experience = JSON.parse(experience);
  } catch {
    user.profile.experience = experience;
  }
}

if (education) {
  try {
    user.profile.education = JSON.parse(education);
  } catch {
    user.profile.education = education;
  }
}

    // ✅ MANUAL SKILLS
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      user.profile.skills = skillsArray;
      user.profile.skillsSource = "manual";
    }

    // ✅ PROFILE IMAGE (keep base64 — works fine for images)
    if (profilePhotoFile) {
      const base64 = profilePhotoFile.buffer.toString("base64");

      const cloudResponse = await cloudinary.uploader.upload(
        `data:${profilePhotoFile.mimetype};base64,${base64}`,
      );

      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    // ✅ RESUME UPLOAD (FIXED — BUFFER STREAM)
if (resumeFile) {

  // =========================
  // VALIDATION
  // =========================

  const allowedMimeTypes = [
    "application/pdf",
  ];

  if (
    !allowedMimeTypes.includes(
      resumeFile.mimetype
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  // 5MB LIMIT
  if (resumeFile.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: "Maximum file size is 5MB",
    });
  }

  try {

    // =========================
    // CLEAN FILE NAME
    // =========================



    // =========================
    // CLOUDINARY UPLOAD
    // =========================

  const fileNameWithoutExt =
  resumeFile.originalname
    .replace(/\.[^/.]+$/, "")
    .replace(/\s+/g, "_");

const uploadFromBuffer = () =>
  new Promise((resolve, reject) => {

    const stream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",

          folder: "resumes",

          access_mode: "public",

          // IMPORTANT
          // no .pdf here
          public_id:
            `${Date.now()}-${fileNameWithoutExt}`,

          overwrite: true,
        },

        (error, result) => {

          if (error) {
            console.log(
              "Cloudinary Upload Error:",
              error
            );

            return reject(error);
          }

          resolve(result);
        }
      );

    // upload binary directly
    stream.end(resumeFile.buffer);
  });

const result =
  await uploadFromBuffer();

console.log(result.secure_url);
    // =========================
    // SAVE URL
    // =========================

    user.profile.resume =
      result.secure_url;

    user.profile.resumeOriginalName =
      resumeFile.originalname;

    // =========================
    // SKILL EXTRACTION
    // =========================

    if (!skills) {

      try {

        // PDF PARSE
        const data = await pdf(
          resumeFile.buffer
        );

        const text =
          data.text || "";

        // EXTRACT SKILLS
        const extracted =
          extractSkills(text);

        if (extracted.length > 0) {

          user.profile.skills =
            extracted;

          user.profile.skillsSource =
            "resume";
        }

      } catch (err) {

        console.log(
          "PDF Parse Error:",
          err
        );

      }
    }

  } catch (err) {

    console.log(
      "Resume Upload Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload resume",
    });
  }
}

    // ✅ SAVE USER
    await user.save();


    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
