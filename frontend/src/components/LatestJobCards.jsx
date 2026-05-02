import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {

     console.log("Jobs:", job);
    const navigate = useNavigate();

    return (
        <div

            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition'
        >
           
            {/* Company */}
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>

            {/* Job Info */}
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2'>
                    {job?.description}
                </p>
            </div>

            {/* Tags */}
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className='text-blue-700 font-bold' variant="ghost">
                    {job?.position} Positions
                </Badge>

                <Badge className='text-[#F83002] font-bold' variant="ghost">
                    {job?.jobType}
                </Badge>

                <Badge className='text-[#7209b7] font-bold' variant="ghost">
                    {job?.salary} LPA
                </Badge>

                {/* 🔥 MATCH SCORE */}
                {job?.matchScore != null && (
                    <Badge className='bg-green-100 text-green-700 font-bold'>
                        {job.matchScore}%
                    </Badge>
                )}

                {/* 🔥 MATCH LABEL */}
                {job?.matchScore >= 80 && (
                    <Badge className='bg-green-500 text-white'>
                        🔥 Best Match
                    </Badge>
                )}

                {job?.matchScore >= 50 && job?.matchScore < 80 && (
                    <Badge className='bg-yellow-400 text-white'>
                        👍 Good Match
                    </Badge>
                )}

                {job?.matchScore < 50 && job?.matchScore != null && (
                    <Badge className='bg-red-400 text-white'>
                        ⚠ Low Match
                    </Badge>
                )}
            </div>

        </div>
    )
}

export default LatestJobCards