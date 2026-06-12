import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { User } from "./models/user.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";
import { Company } from "./models/company.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= LOAD ENV =================

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ================= CONNECT DB =================

await mongoose.connect(process.env.MONGODB_URI);

console.log("MongoDB Connected");

// ================= STATIC DATA =================

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Software Engineer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
  "Data Analyst",
  "QA Engineer",
];

const skillsList = [
  ["React", "JavaScript", "CSS"],

  ["Node.js", "Express.js", "MongoDB"],

  ["React", "Node.js", "MongoDB"],

  ["Java", "Spring Boot", "MySQL"],

  ["Python", "Django", "PostgreSQL"],

  ["HTML", "CSS", "Tailwind CSS"],

  ["Redux", "React", "Firebase"],

  ["Docker", "AWS", "Linux"],

  ["Next.js", "TypeScript", "MongoDB"],
];

const locations = [
  "Pune",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Delhi",
  "Chennai",
];

const companiesData = [
  "Google",
  "Microsoft",
  "Amazon",
  "Infosys",
  "TCS",
  "Wipro",
  "Meta",
  "Netflix",
  "Adobe",
  "Accenture",
];

// ================= SEED FUNCTION =================

const seedDatabase = async () => {
  try {

    // ================= DELETE OLD DATA =================
    // Uncomment if you want fresh database

    /*
    await Application.deleteMany({});
    await Job.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});
    */

    console.log("Starting Database Seeding...");

    // ================= CREATE USERS =================

    const users = [];

    for (let i = 1; i <= 25; i++) {

      const hashedPassword = await bcrypt.hash(
        "123456",
        10
      );

      const role =
        i <= 18 ? "student" : "recruiter";

      const selectedSkills =
        faker.helpers.arrayElement(skillsList);

      const user = await User.create({
        fullname: faker.person.fullName(),

        email: `user${i}@gmail.com`,

        phoneNumber: Number(
          `9${faker.number.int({
            min: 100000000,
            max: 999999999,
          })}`
        ),

        password: hashedPassword,

        role,

        profile: {
          profilePhoto:
            "https://randomuser.me/api/portraits/men/1.jpg",

          skills: selectedSkills,

          skillsSource: "manual",

          bio:
            faker.helpers.arrayElement(jobTitles),

          resume:
            "https://example.com/resume.pdf",

          resumeOriginalName:
            "resume.pdf",

          achievements: [],

          age: faker.number.int({
            min: 20,
            max: 35,
          }),

          certifications: [],

          education: [
            {
              institute:
                "Sinhgad Institute",

              degree: "BCA",

              startYear: 2020,

              endYear: 2023,
            },
          ],

          experience: [
            {
              company:
                faker.helpers.arrayElement(
                  companiesData
                ),

              role:
                faker.helpers.arrayElement(
                  jobTitles
                ),

              startDate: "2023-01",

              endDate: "2024-01",
            },
          ],

          experienceYears:
            faker.number.int({
              min: 0,
              max: 5,
            }),

          location:
            faker.helpers.arrayElement(
              locations
            ),
        },
      });

      users.push(user);
    }

    console.log("25 Users Created");

    // ================= CREATE COMPANIES =================

    const recruiters = users.filter(
      (u) => u.role === "recruiter"
    );

    const companies = [];

    for (let i = 0; i < recruiters.length; i++) {

      const companyName =
        faker.helpers.arrayElement(
          companiesData
        );

      const company = await Company.create({
        name: companyName,

        userId: recruiters[i]._id,

        description:
          `${companyName} is an IT consultancy company.`,

        location:
          faker.helpers.arrayElement(
            locations
          ),

        logo:
          "https://dummyimage.com/200x200/000/fff.png",

        website:
          `https://${companyName.toLowerCase()}.com`,
      });

      companies.push(company);
    }

    console.log("Companies Created");

    // ================= CREATE JOBS =================

    const jobs = [];

    for (let i = 0; i < 25; i++) {

      const recruiter =
        recruiters[
          Math.floor(
            Math.random() *
              recruiters.length
          )
        ];

      const company =
        companies[
          Math.floor(
            Math.random() *
              companies.length
          )
        ];

      const selectedTitle =
        faker.helpers.arrayElement(
          jobTitles
        );

      const selectedRequirements =
        faker.helpers.arrayElement(
          skillsList
        );

      const job = await Job.create({
        title: selectedTitle,

        description:
          `We are hiring a ${selectedTitle} with strong technical knowledge and problem solving skills.`,

        requirements:
          selectedRequirements,

        salary:
          faker.number.int({
            min: 3,
            max: 25,
          }),

        experienceLevel:
          faker.helpers.arrayElement([
            "fresher",
            "1 year",
            "2 years",
            "3 years",
          ]),

        location:
          faker.helpers.arrayElement(
            locations
          ),

        jobType:
          faker.helpers.arrayElement([
            "full time",
            "remote",
            "internship",
          ]),

        position:
          faker.number.int({
            min: 1,
            max: 20,
          }),

        company: company._id,

        created_by:
          recruiter._id,

        applications: [],
      });

      jobs.push(job);
    }

    console.log("25 Jobs Created");

    // ================= CREATE APPLICATIONS =================

    const students = users.filter(
      (u) => u.role === "student"
    );

    for (let i = 0; i < 25; i++) {

      const student =
        students[
          Math.floor(
            Math.random() *
              students.length
          )
        ];

      const job =
        jobs[
          Math.floor(
            Math.random() *
              jobs.length
          )
        ];

      const application =
        await Application.create({
          job: job._id,

          applicant:
            student._id,

          status:
            faker.helpers.arrayElement([
              "pending",
              "accepted",
              "rejected",
            ]),
        });

      // push application id into job

      job.applications.push(
        application._id
      );

      await job.save();
    }

    console.log("25 Applications Created");

    console.log(
      "Database Seeded Successfully"
    );

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedDatabase(); 