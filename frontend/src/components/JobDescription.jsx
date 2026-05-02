import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const isInitiallyApplied =
    singleJob?.applications?.some(app => app.applicant === user?._id) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

 const applyJobHandler = async () => {
  if (!user) {
    toast.error("Please login first");
    return;
  }

  try {
    const res = await axios.get(
      `${APPLICATION_API_END_POINT}/apply/${jobId}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      setIsApplied(true);

      const updatedSingleJob = {
        ...singleJob,
        applications: [
          ...singleJob.applications,
          { applicant: user?._id }
        ]
      };

      dispatch(setSingleJob(updatedSingleJob));
      toast.success(res.data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message);
  }
};

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          setIsApplied(
            res.data.job.applications?.some(
              app => app.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className='max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg'>

      {/* HEADER */}
      <div className='flex justify-between items-start flex-wrap gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>{singleJob?.title}</h1>

          <div className='flex flex-wrap gap-2 mt-3'>
            <Badge variant="ghost" className='text-blue-700 font-bold'>
              {singleJob?.position} Positions
            </Badge>

            <Badge variant="ghost" className='text-red-600 font-bold'>
              {singleJob?.jobType}
            </Badge>

            <Badge variant="ghost" className='text-purple-700 font-bold'>
              {singleJob?.salary} LPA
            </Badge>

            {/* 🔥 MATCH SCORE */}
            {singleJob?.matchScore != null && (
              <Badge className='bg-green-100 text-green-700 font-bold'>
                Match: {singleJob.matchScore}%
              </Badge>
            )}
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isApplied ? 'Already Applied' : 'Apply Now'}
        </Button>
      </div>

      {/* DIVIDER */}
      <hr className='my-6' />

      {/* DETAILS */}
      <div className='space-y-3 text-gray-800'>

        <p><b>Role:</b> {singleJob?.title}</p>
        <p><b>Location:</b> {singleJob?.location}</p>
        <p><b>Description:</b> {singleJob?.description}</p>
        <p><b>Experience:</b> {singleJob?.experienceLevel}</p>
        <p><b>Salary:</b> {singleJob?.salary} LPA</p>

        <p>
          <b>Total Applicants:</b>{" "}
          {singleJob?.applications?.length || 0}
        </p>

        <p>
          <b>Posted Date:</b>{" "}
          {singleJob?.createdAt?.split("T")[0]}
        </p>
      </div>

      {/* 🔥 SKILLS SECTION */}
      <div className='mt-6'>
        <h2 className='font-bold mb-2'>Required Skills:</h2>

        <div className='flex flex-wrap gap-2'>
          {singleJob?.requirements?.length > 0 ? (
            singleJob.requirements.map((skill, index) => (
              <Badge key={index} className='bg-gray-200 text-black'>
                {skill}
              </Badge>
            ))
          ) : (
            <span>No skills listed</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default JobDescription;