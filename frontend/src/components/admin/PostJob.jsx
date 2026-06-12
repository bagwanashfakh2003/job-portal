import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  JOB_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/constant";
import { toast } from "sonner";

const PostJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = !!id;

  const [companies, setCompanies] = useState([]);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experience: "",
    jobType: "",
    position: "",
    companyId: "",
  });

  const changeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setCompanies(res.data.companies);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch Job For Edit
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const job = res.data.job;

          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: Array.isArray(job.requirements)
              ? job.requirements.join(", ")
              : "",
            salary: job.salary || "",
            location: job.location || "",
            experience: job.experienceLevel || "",
            jobType: job.jobType || "",
            position: job.position || "",
            companyId: job.company?._id || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchJob();
  }, [id]);

  // Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(input);

    try {
      let res;

      if (isEditMode) {
        res = await axios.put(
          `${JOB_API_END_POINT}/update/${id}`,
          input,
          {
            withCredentials: true,
          }
        );
      } else {
        res = await axios.post(
          `${JOB_API_END_POINT}/post`,
          input,
          {
            withCredentials: true,
          }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-3xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-xl">
              {isEditMode ? "Update Job" : "Post Job"}
            </h1>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/jobs")}
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={input.title}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                name="requirements"
                value={input.requirements}
                onChange={changeHandler}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                value={input.salary}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                name="experience"
                value={input.experience}
                onChange={changeHandler}
                placeholder="fresher / 1 year / 2 years / 3+ years"
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                name="jobType"
                value={input.jobType}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Position</Label>
              <Input
                name="position"
                value={input.position}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Company</Label>

              <select
                name="companyId"
                value={input.companyId}
                onChange={changeHandler}
                className="w-full h-10 border rounded-md px-3"
              >
                <option value="">Select Company</option>

                {companies.map((company) => (
                  <option
                    key={company._id}
                    value={company._id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full my-4"
          >
            {isEditMode ? "Update Job" : "Post Job"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;