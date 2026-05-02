import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText, Download, Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const hasSkills = user?.profile?.skills?.length > 0;
  const hasResume = !!user?.profile?.resume;

  // This ensures the URL is formatted for viewing rather than raw data
  const resumeUrl = user?.profile?.resume;
  const resumeName = user?.profile?.resumeOriginalName || "resume.pdf";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* PROFILE CARD */}
      <div className="max-w-4xl mx-auto bg-white shadow-md border rounded-2xl my-6 p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <Avatar className="h-24 w-24 border">
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://via.placeholder.com/150"}
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{user?.fullname || "No Name"}</h1>
              <p className="text-gray-600 text-sm mt-1">{user?.profile?.bio || "No bio added"}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center gap-2">
            <Pen size={16} /> Edit
          </Button>
        </div>

        {/* CONTACT INFO */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={18} />
            <span>{user?.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact size={18} />
            <span>{user?.phoneNumber || "No phone number"}</span>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Skills</h2>
          {hasSkills ? (
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill, index) => (
                <Badge key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added</p>
          )}
        </div>

        {/* RESUME SECTION */}
        <div className="mt-6 border-t pt-4">
          <Label className="font-semibold text-lg">Resume</Label>
          {hasResume ? (
            <div className="mt-3">
              <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg w-fit">
                <FileText className="text-red-500" />
                <span className="text-sm font-medium truncate max-w-[200px]">{resumeName}</span>
                
                <div className="flex gap-2 ml-4">
                  {/* VIEW BUTTON */}
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Eye size={16} /> View
                  </a>

                  {/* DOWNLOAD BUTTON */}
                  <a
                    href={resumeUrl}
                    download={resumeName}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              </div>

              {/* OPTIONAL: EMBEDDED PREVIEW */}
              <div className="mt-4 rounded-lg overflow-hidden border h-[400px] bg-white">
                 <iframe 
                    src={resumeUrl} 
                    title="Resume Preview" 
                    className="w-full h-full"
                    frameBorder="0"
                 />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No resume uploaded</p>
          )}
        </div>
      </div>

      {/* APPLIED JOBS SECTION */}
      <div className="max-w-4xl mx-auto bg-white shadow-md border rounded-2xl p-6 mb-10">
        <h1 className="font-semibold text-xl mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;