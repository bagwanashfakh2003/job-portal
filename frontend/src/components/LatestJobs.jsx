import React from 'react'
import { useSelector } from 'react-redux'
import LatestJobCards from './LatestJobCards'

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    console.log("All Jobs:", allJobs); // ✅ DEBUG

    return (
        <div className='max-w-7xl mx-auto my-10'>
            
            <h1 className='text-3xl font-bold mb-5'>
                <span className='text-purple-600'>Latest</span> Jobs
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

                {
                    allJobs?.length === 0 ? (
                        <p>No jobs available</p>
                    ) : (
                        allJobs?.map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                    )
                }

            </div>
        </div>
    )
}

export default LatestJobs