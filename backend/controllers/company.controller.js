import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ REGISTER COMPANY
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });

        if (company) {
            return res.status(400).json({
                message: "Company already exists.",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
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


// ✅ GET ALL COMPANIES (FOR USER)
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        const companies = await Company.find({ userId });

        return res.status(200).json({
            companies,
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


// ✅ GET COMPANY BY ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    // ✅ Only fetch company belonging to logged-in user
    const company = await Company.findOne({
      _id: companyId,
      userId: userId
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or unauthorized",
        success: false
      });
    }

    return res.status(200).json({
      company,
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


// ✅ UPDATE COMPANY (FIXED VERSION)
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        let logo;

        // ✅ ONLY upload if file exists
        if (file) {
            const fileUri = getDataUri(file);

            if (fileUri) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                    logo = cloudResponse.secure_url;
                } catch (err) {
                    console.log("Cloudinary error:", err);
                }
            }
        }

        const updateData = {
            name,
            description,
            website,
            location
        };

        // ✅ add logo only if uploaded
        if (logo) {
            updateData.logo = logo;
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
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