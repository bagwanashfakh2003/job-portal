import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { calculateMatch } from "../utils/skillMatch.js";


// ==============================
// ✅ POST JOB
// ==============================
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map(r => r.trim().toLowerCase()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// ==============================
// ✅ GET ALL JOBS (WITH MATCHING)
// ==============================
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    let user = null;

    if (req.id) {
      user = await User.findById(req.id);
    }

    const userSkills = user?.profile?.skills || [];

    const jobsWithScore = jobs.map(job => {
      let requirements = job.requirements || [];

      if (typeof requirements === "string") {
        requirements = requirements.split(",").map(s => s.trim().toLowerCase());
      }

      let matchScore = null;

      if (userSkills.length > 0) {
        matchScore = calculateMatch(userSkills, requirements);
      }

      return {
        ...job._doc,
        matchScore
      };
    });

    return res.status(200).json({
      jobs: jobsWithScore,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// ==============================
// ✅ GET SINGLE JOB (FOR USER VIEW)
// ==============================
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    const applications = await Application.find({ job: jobId });

    let matchScore = null;

    if (req.id) {
      const user = await User.findById(req.id);
      const userSkills = user?.profile?.skills || [];

      if (userSkills.length > 0) {
        matchScore = calculateMatch(userSkills, job.requirements);
      }
    }

    const jobObj = job.toObject();

    jobObj.applications = applications || [];
    jobObj.matchScore = matchScore;

    return res.status(200).json({
      job: jobObj,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// ==============================
// ✅ GET APPLICANTS (RECRUITER VIEW)
// ==============================
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant");

    const applicantsWithScore = applications.map(app => {
      const userSkills = app.applicant?.profile?.skills || [];

      const matchScore = userSkills.length
        ? calculateMatch(userSkills, job.requirements)
        : 0;

      return {
        ...app._doc,
        applicant: app.applicant,
        matchScore
      };
    });

    applicantsWithScore.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      applicants: applicantsWithScore,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// ==============================
// ✅ GET ADMIN JOBS
// ==============================
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const updatedData = req.body;

        const job = await Job.findByIdAndUpdate(
            jobId,
            updatedData,
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};