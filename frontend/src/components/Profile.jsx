import React, { useMemo, useState } from "react";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";

import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";

import { Button } from "./ui/button";

import {
  Pen,
  Mail,
  Contact,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const Profile = () => {
  useGetAppliedJobs();

  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);

  const profile = user?.profile || {};

  console.log("Resume URL:", profile?.resume);

  // ================= PROFILE COMPLETION =================

  const completion = useMemo(() => {
    let score = 0;

    const total = 10;

    if (user?.fullname) score++;
    if (user?.email) score++;
    if (user?.phoneNumber) score++;

    if (profile?.bio) score++;

    if (profile?.skills?.length) score++;

    if (profile?.profilePhoto) score++;

    if (profile?.resume) score++;

    if (profile?.experience?.length) score++;

    if (profile?.education?.length) score++;

    if (profile?.location) score++;

    return Math.round((score / total) * 100);
  }, [user, profile]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT SIDEBAR ================= */}

        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          {/* PROFILE */}

          <div className="flex flex-col items-center text-center">
            <img
              src={profile?.profilePhoto || "https://via.placeholder.com/150"}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user?.fullname || "User"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {profile?.bio || "No bio added"}
            </p>
          </div>

          {/* CONTACT */}

          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{user?.email || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Contact size={16} />
              <span>{user?.phoneNumber || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{profile?.location || "No location"}</span>
            </div>
          </div>

          {/* SKILLS */}

          <div className="mt-8">
            <h3 className="font-semibold mb-3">Skills</h3>

            {profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No skills added</p>
            )}
          </div>

          {/* NOTES */}

          {profile?.notes && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Notes</h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {profile.notes}
              </p>
            </div>
          )}

          {/* EDIT BUTTON */}

          <Button onClick={() => setOpen(true)} className="w-full mt-8">
            <Pen size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* ================= RIGHT SECTION ================= */}

        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE COMPLETION */}

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Profile Completion</h2>

              <span className="text-sm font-medium text-blue-600">
                {completion}%
              </span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>

          {/* BASIC INFO */}

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-xl mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              <InfoItem label="Age" value={profile?.age} />

              <InfoItem
                label="Experience"
                value={`${profile?.experienceYears || 0} yrs`}
              />

              <InfoItem label="Phone" value={user?.phoneNumber} />

              <InfoItem label="Expected CTC" value={profile?.ctc} />

              <InfoItem label="Location" value={profile?.location} />

              <InfoItem label="Email" value={user?.email} />
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">
              {profile?.resume ? (
                <a
                  href={profile.resume}
                  download={profile.resumeOriginalName}
                  rel="noopener noreferrer"
                >
                  <Button type="button">Download Resume</Button>
                </a>
              ) : (
                <Button type="button" disabled>
                  No Resume
                </Button>
              )}

              <Button type="button" variant="outline">
                <Mail size={16} className="mr-2" />
                Contact
              </Button>
            </div>
          </div>

          {/* EXPERIENCE */}

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase size={20} />

              <h2 className="font-semibold text-xl">Experience</h2>
            </div>

            {profile?.experience?.filter((exp) => exp.company)?.length > 0 ? (
              <div className="relative border-l-2 border-blue-200 ml-3">
                {profile.experience
                  .filter((exp) => exp.company)
                  .map((exp, index) => (
                    <div key={index} className="ml-6 mb-8 relative">
                      <div className="absolute -left-[11px] top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white" />

                      <div className="bg-gray-50 border rounded-xl p-5 hover:shadow-sm transition">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {exp.company}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          {exp.role || "Role not specified"}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {exp.startDate || "N/A"} —{exp.endDate || "Present"}
                        </p>

                        {exp.location && (
                          <p className="text-xs text-gray-500 mt-2">
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No experience added</p>
            )}
          </div>

          {/* EDUCATION */}

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap size={20} />

              <h2 className="font-semibold text-xl">Education</h2>
            </div>

            {profile?.education?.length > 0 ? (
              <div className="space-y-5">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border rounded-xl p-4">
                    <p className="font-semibold text-gray-800">
                      {edu.degree || "Degree"}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {edu.institute || "Institute"}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {edu.startYear || "N/A"} —{edu.endYear || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No education added</p>
            )}
          </div>

          {/* APPLIED JOBS */}

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-xl mb-4">Applied Jobs</h2>

            <AppliedJobTable />
          </div>
        </div>
      </div>

      {/* DIALOG */}

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

// ================= REUSABLE INFO ITEM =================

const InfoItem = ({ label, value }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  );
};

export default Profile;
