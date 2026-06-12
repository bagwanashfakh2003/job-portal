import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { Loader2, Plus, Trash2, X } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    age: "",
    location: "",
    ctc: "",
    experienceYears: "",

    experience: [],
    education: [],

    profilePhoto: null,
    resume: null,
  });

  // ================= LOAD USER =================

  useEffect(() => {
    if (!user) return;

    setInput({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",

      bio: user?.profile?.bio || "",
      skills: user?.profile?.skills?.join(", ") || "",
      age: user?.profile?.age || "",
      location: user?.profile?.location || "",
      ctc: user?.profile?.ctc || "",
      experienceYears: user?.profile?.experienceYears || "",

      experience: user?.profile?.experience || [],
      education: user?.profile?.education || [],

      profilePhoto: null,
      resume: null,
    });
  }, [user]);

  // ================= INPUT =================

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= FILE =================

  const fileHandler = (e) => {
    const { name, files } = e.target;

    const file = files?.[0];

    if (!file) return;

    if (name === "profilePhoto") {
      if (!file.type.startsWith("image/")) {
        return toast.error("Only image allowed");
      }

      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image max size is 2MB");
      }
    }

    if (name === "resume") {
      const allowed =
        file.type === "application/pdf" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx");

      if (!allowed) {
        return toast.error("Only PDF/DOC/DOCX allowed");
      }
    }

    setInput((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    const newErrors = {};

    if (!input.fullname.trim()) {
      newErrors.fullname = "Fullname required";
    }

    if (!input.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (input.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (
      input.experienceYears &&
      (Number(input.experienceYears) < 0 || Number(input.experienceYears) > 50)
    ) {
      newErrors.experienceYears = "Experience must be between 0 and 50";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= EXPERIENCE =================

  const addExperience = () => {
    setInput((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setInput((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...input.experience];

    updated[index][field] = value;

    setInput((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  // ================= EDUCATION =================

  const addEducation = () => {
    setInput((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institute: "",
          degree: "",
          startYear: "",
          endYear: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setInput((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...input.education];

    updated[index][field] = value;

    setInput((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  // ================= SUBMIT =================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);

      formData.append("bio", input.bio);
      formData.append("skills", input.skills);

      formData.append("age", input.age);
      formData.append("location", input.location);
      formData.append("ctc", input.ctc);

      formData.append("experienceYears", Number(input.experienceYears || 0));

      formData.append("experience", JSON.stringify(input.experience));

      formData.append("education", JSON.stringify(input.education));

      if (input.profilePhoto) {
        formData.append("profilePhoto", input.profilePhoto);
      }

      if (input.resume) {
        formData.append("resume", input.resume);
      }

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res?.data?.success) {
        dispatch(setUser(res.data.user));

        toast.success("Profile updated");

        setOpen(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            Update Profile
          </DialogTitle>

          <button type="button" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={submitHandler} className="space-y-8 mt-4">
          {/* BASIC INFO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <Input
                name="fullname"
                value={input.fullname}
                onChange={changeHandler}
              />

              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>

              <Input
                name="email"
                value={input.email}
                onChange={changeHandler}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>

              <Input
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Age</label>

              <Input
                type="number"
                name="age"
                value={input.age}
                onChange={changeHandler}
              />

              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Experience Years</label>

              <Input
                type="number"
                name="experienceYears"
                value={input.experienceYears}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>

              <Input
                name="location"
                value={input.location}
                onChange={changeHandler}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Expected CTC</label>

              <Input name="ctc" value={input.ctc} onChange={changeHandler} />
            </div>

            <div className="md:col-span-2">
  <label className="text-sm font-medium">Skills</label>

  <Input
    name="skills"
    value={input.skills}
    onChange={changeHandler}
    placeholder="React, Node.js, MongoDB, Java"
  />

  <p className="text-xs text-gray-500 mt-1">
    Separate skills with commas
  </p>

  {errors.skills && (
    <p className="text-red-500 text-sm mt-1">
      {errors.skills}
    </p>
  )}
</div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Bio</label>

              <textarea
                name="bio"
                value={input.bio}
                onChange={changeHandler}
                rows={4}
                className="w-full border rounded-md p-2 text-sm resize-none"
                placeholder="Write something about yourself..."
              />

              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
              )}
            </div>
          </div>

          {/* EXPERIENCE */}

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Experience</h2>

                <p className="text-sm text-muted-foreground">
                  Add your work history
                </p>
              </div>

              <Button type="button" onClick={addExperience}>
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            </div>

            {input.experience.map((exp, index) => (
              <div
                key={index}
                className="border rounded-2xl p-5 space-y-4 relative"
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-red-500"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                  />

                  <Input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(index, "role", e.target.value)
                    }
                  />

                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "startDate", e.target.value)
                    }
                  />

                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </section>

          {/* EDUCATION */}

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Education</h2>

                <p className="text-sm text-muted-foreground">
                  Add education details
                </p>
              </div>

              <Button type="button" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            </div>

            {input.education.map((edu, index) => (
              <div
                key={index}
                className="border rounded-2xl p-5 space-y-4 relative"
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-red-500"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Institute"
                    value={edu.institute}
                    onChange={(e) =>
                      handleEducationChange(index, "institute", e.target.value)
                    }
                  />

                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Start Year"
                    value={edu.startYear}
                    onChange={(e) =>
                      handleEducationChange(index, "startYear", e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    placeholder="End Year"
                    value={edu.endYear}
                    onChange={(e) =>
                      handleEducationChange(index, "endYear", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </section>

          {/* FILES */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Profile Photo</label>

              <Input type="file" name="profilePhoto" onChange={fileHandler} />
            </div>

            <div>
              <label className="text-sm font-medium">Resume</label>

              <Input type="file" name="resume" onChange={fileHandler} />
            </div>
          </section>

          {/* SUBMIT */}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
