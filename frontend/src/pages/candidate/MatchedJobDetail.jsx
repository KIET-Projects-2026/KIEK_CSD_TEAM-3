import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { applyToJob, getCandidateApplications, getAllJobs } from '../../api/apiClient';

const MatchedJobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialJob = location.state?.job;
  const [job, setJob] = useState(initialJob);

  const [isApplied, setIsApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAppStatus, setLoadingAppStatus] = useState(true);

  // Fallback: Fetch latest job data if company name is missing/default
  useEffect(() => {
    if (job?.jobId && (!job.companyName || job.companyName === 'Company Not Specified')) {
        const fetchFreshData = async () => {
            try {
                const response = await getAllJobs();
                const freshJob = response.data.find(j => j._id === job.jobId || j.id === job.jobId);
                if (freshJob) {
                    // Merge fresh data but preserve score if missing in list response (though list should have it? No, list is from DB, score is from match)
                    // Actually getAllJobs returns DB objects, NOT match scores.
                    // So we only update static fields: companyName, title, description, etc.
                    setJob(prev => ({
                        ...prev,
                        companyName: freshJob.companyName || prev.companyName,
                        location: freshJob.location || prev.location,
                        // Update other fields if needed
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch fresh job details", error);
            }
        };
        fetchFreshData();
    }
  }, [job?.jobId]); 

  useEffect(() => {
      if (job?.jobId) {
          checkApplicationStatus();
      } else {
          setLoadingAppStatus(false);
      }
  }, [job]);

  const checkApplicationStatus = async () => {
      try {
          const response = await getCandidateApplications();
           // Check if current job ID exists in the applications list
           // Adjust comparison based on actual object/string structure
          const hasApplied = response.data.some(app => {
              const appJobId = app.jobId && (app.jobId._id || app.jobId);
              return appJobId === job.jobId;
          });
          setIsApplied(hasApplied);
      } catch (error) {
          console.error("Failed to check application status", error);
      } finally {
          setLoadingAppStatus(false);
      }
  };

  const handleApply = async () => {
      if (isApplied || isSubmitting) return;

      setIsSubmitting(true);
      try {
          await applyToJob(job.jobId, {});
          setIsApplied(true);
          // Optional: Success toast
      } catch (error) {
          console.error("Failed to apply", error);
          alert("Application failed. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match not found</h2>
            <p className="text-gray-600 mb-6">We couldn't retrieve the match details for this job.</p>
            <Link to="/candidate/job-matches" className="text-indigo-600 hover:text-indigo-800 font-medium">
                &larr; Back to Matches
            </Link>
        </div>
      </div>
    );
  }

  const score = Math.round(job.score);
  let badgeColor = "bg-gray-100 text-gray-800";
  let badgeText = "Good Match";
  if (score >= 80) {
      badgeColor = "bg-green-100 text-green-800";
      badgeText = "Excellent Match";
  } else if (score >= 60) {
      badgeColor = "bg-indigo-100 text-indigo-800";
      badgeText = "Strong Match";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Results
        </button>

        {/* Main Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8 md:flex justify-between items-start gap-8 bg-gradient-to-r from-white to-gray-50">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-600/10">
                            {job.jobType || 'Full-time'}
                        </span>
                        <span className="text-sm text-gray-500">ID: {job.jobId?.substring(0,8)}</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                        {job.title || 'Job Position'}
                    </h1>
                     <div className="flex items-center text-gray-600 text-sm gap-6">
                         <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {job.companyName || 'Company Not Specified'}
                        </span>
                         <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             {job.location || 'Location Not Specified'}
                        </span>
                     </div>
                </div>
                
                {/* Score Circle */}
                <div className="mt-6 md:mt-0 flex flex-col items-center">
                    <div className="relative w-32 h-32">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                            <circle 
                                cx="64" 
                                cy="64" 
                                r="60" 
                                stroke="#4f46e5" 
                                strokeWidth="10" 
                                fill="transparent" 
                                strokeDasharray={377} 
                                strokeDashoffset={377 - (377 * score) / 100} 
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">{score}%</span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 ${badgeColor}`}>
                         {badgeText}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                
                {/* Left: Description */}
                <div className="p-8 md:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium uppercase">Experience</p>
                            <p className="text-sm font-semibold text-gray-900">{job.minExperience || 0} - {job.maxExperience || 'Any'} Years</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium uppercase">Education</p>
                            <p className="text-sm font-semibold text-gray-900">{job.education || 'Any Degree'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium uppercase">Job Type</p>
                            <p className="text-sm font-semibold text-gray-900">{job.jobType || 'Full-time'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                            <p className="text-sm font-semibold text-gray-900">{job.location || 'Remote'}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4">About the Role</h3>
                    <p className="text-gray-600 leading-relaxed max-w-none text-base">
                        {job.description || 'No detailed description provided for this role.'}
                    </p>
                    
                    <div className="mt-8">
                         <h3 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h3>
                         <div className="flex flex-wrap gap-2">
                             {/* Combining for display, though conceptually separated below */}
                             {[...(job.matchingSkills||[]), ...(job.missingSkills||[])].slice(0, 10).map(s => (
                                 <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">{s}</span>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right: AI Analysis */}
                <div className="p-8 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Analysis
                    </h3>
                    
                    {/* Matching */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold text-green-700 mb-3">Your Strengths</h4>
                        <div className="space-y-2">
                             {job.matchingSkills?.length > 0 ? job.matchingSkills.map(skill => (
                                 <div key={skill} className="flex items-start">
                                     <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                     <span className="text-sm text-gray-700">{skill}</span>
                                 </div>
                             )) : <span className="text-sm text-gray-500 italic">No direct skill matches found.</span>}
                        </div>
                    </div>

                    {/* Missing */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                             <h4 className="text-xs font-semibold text-gray-600">Gaps / To Improve</h4>
                             {job.missingSkills?.length > 0 && 
                                <span className="text-xs text-indigo-600 hover:underline cursor-pointer">View Courses</span>
                             }
                        </div>
                        <div className="space-y-2">
                             {job.missingSkills?.length > 0 ? job.missingSkills.map(skill => (
                                 <div key={skill} className="flex items-start">
                                     <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 mt-0.5">
                                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                     </div>
                                     <span className="text-sm text-gray-500">{skill}</span>
                                 </div>
                             )) : <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">No significant gaps!</div>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleApply}
                            disabled={isApplied || isSubmitting || loadingAppStatus}
                            className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white transform hover:-translate-y-0.5 transition-all
                                ${isApplied 
                                    ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                                    : isSubmitting || loadingAppStatus
                                        ? 'bg-indigo-400 cursor-wait'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }
                            `}
                        >
                             {isApplied ? (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Applied Successfully
                                </span>
                            ) : isSubmitting ? 'Submitting Application...' : 'Apply for this Job'}
                        </button>
                        {!isApplied && (
                            <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50">
                                Save for Later
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MatchedJobDetail;
