import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();

  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'recruiter' && location.pathname === "/") {
      navigate("/admin/companies");
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
      </main>

      <Footer />
    </div>
  )
}

export default Home;