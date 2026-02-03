import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { applyToJob, getCandidateApplications } from '../../api/apiClient';

const JobMatches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'date'
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loadingApps, setLoadingApps] = useState(true);
  
  // Use location state matches or empty array
  const initialJobs = location.state?.matches || [];
  
  // Fetch applied jobs on mount
  useEffect(() => {
      const fetchApplications = async () => {
          try {
              const response = await getCandidateApplications();
              // Assuming response.data is array of applications with jobId
              // If structure differs, adjust traversing: e.g. app.jobId._id or app.jobId
              const ids = new Set(response.data.map(app => (app.jobId && (app.jobId._id || app.jobId)) || '')); 
              setAppliedJobIds(ids);
          } catch (error) {
              console.error("Failed to fetch applications", error);
          } finally {
              setLoadingApps(false);
          }
      };
      fetchApplications();
  }, []);

  // Sort jobs based on selection
  const sortedJobs = [...initialJobs].sort((a, b) => {
      if (sortBy === 'score') {
          return b.score - a.score;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); 
  });

  const handleApply = async (jobId) => {
      if (appliedJobIds.has(jobId)) return;

      try {
          await applyToJob(jobId, {});
          setAppliedJobIds(prev => new Set(prev).add(jobId));
          // Optional: Show toast
      } catch (error) {
          console.error("Application failed", error);
          alert("Failed to apply. Please try again.");
      }
  };

  if (!location.state?.matches) {
      return (
          <div className="min-h-[80vh] flex flex-col justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="w-full max-w-3xl text-center space-y-8">
                  {/* Hero Section */}
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                          <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                      </div>
                      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                          Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect Career Match</span>
                      </h1>
                      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                          Our AI-powered engine analyzes your resume to find jobs that perfectly align with your skills, experience, and career goals.
                      </p>
                  </div>

                  {/* How it Works - Steps */}
                  <div className="grid md:grid-cols-3 gap-8 py-8 border-t border-b border-gray-100 my-8">
                      <div className="flex flex-col items-center">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
                           <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
                           <p className="text-sm text-gray-500">Upload your latest PDF or DOCX resume to get started.</p>
                      </div>
                      <div className="flex flex-col items-center">
                           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
                           <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
                           <p className="text-sm text-gray-500">Our engine extracts your key skills and qualifications.</p>
                      </div>
                      <div className="flex flex-col items-center">
                           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
                           <h3 className="font-semibold text-gray-900 mb-2">Get Matched</h3>
                           <p className="text-sm text-gray-500">See ranked job opportunities tailored just for you.</p>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link 
                          to="/candidate/upload-resume" 
                          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Resume Now
                      </Link>
                      <Link 
                          to="/candidate/specific-match" 
                          className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all"
                      >
                          Check Specific Job
                      </Link>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-6">
                      Trusted by top companies to find the best talent.
                  </p>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Top Job Matches</h1>
            <p className="mt-2 text-gray-600">Based on your AI resume analysis</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            >
                <option value="score">Match Score (High to Low)</option>
                {/* <option value="date">Newest First</option> */}
            </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {sortedJobs.map((match) => (
            <MatchCard 
                key={match.jobId} 
                match={match} 
                onApply={handleApply} 
                isApplied={appliedJobIds.has(match.jobId)}
            />
        ))}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const MatchCard = ({ match, onApply, isApplied }) => {
    const score = Math.round(match.score);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Determine badge color
    let badgeColor = "bg-gray-100 text-gray-800";
    let badgeLabel = "Good Match";
    if (score >= 80) {
        badgeColor = "bg-green-100 text-green-800 ring-1 ring-green-600/20";
        badgeLabel = "Excellent Match";
    } else if (score >= 60) {
        badgeColor = "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-600/20";
        badgeLabel = "Strong Match";
    } else if (score < 40) {
        badgeColor = "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20";
        badgeLabel = "Potential Match";
    }

    const displayedMatchingSkills = match.matchingSkills?.slice(0, 5) || [];
    const remainingMatchingStart = match.matchingSkills?.length - 5;
    
    const displayedMissingSkills = match.missingSkills?.slice(0, 3) || [];

    const handleApplyClick = async () => {
        setIsSubmitting(true);
        await onApply(match.jobId);
        setIsSubmitting(false);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    
                    {/* Left: Job Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {match.type || 'Full-time'}
                            </span>
                            {/* Placeholder for location if available */}
                            {match.location && (
                                <span className="text-xs text-gray-500 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {match.location}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {match.title || 'Job Title Unavailable'}
                        </h3>
                        {match.company && (
                             <p className="text-sm font-medium text-gray-700">{match.company}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 max-w-2xl">
                            {match.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Right: Score Badge */}
                    <div className="flex flex-col items-end min-w-[120px]">
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeColor} mb-2`}>
                            {badgeLabel}
                        </div>
                        <div className="flex items-baseline">
                             <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{score}</span>
                             <span className="text-lg text-gray-400 font-medium ml-0.5">%</span>
                        </div>
                    </div>
                </div>

                {/* Middle: Skills Analysis */}
                <div className="mt-6 grid md:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
                    
                    {/* Matching Skills */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Why you matched
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {displayedMatchingSkills.length > 0 ? (
                                <>
                                    {displayedMatchingSkills.map(skill => (
                                        <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 ring-1 ring-green-600/10">
                                            <svg className="w-3 h-3 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {skill}
                                        </span>
                                    ))}
                                    {remainingMatchingStart > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-500 bg-gray-50">
                                            +{remainingMatchingStart} more
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-sm text-gray-400 italic">No specific skills matched directly.</span>
                            )}
                        </div>
                    </div>

                    {/* Missing Skills / Gaps */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Potential Gaps
                            </h4>
                            <span className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium">
                                How to improve?
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {displayedMissingSkills.length > 0 ? (
                                displayedMissingSkills.map(skill => (
                                    <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-50 text-gray-600 ring-1 ring-gray-200 border-dashed border-gray-300">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-green-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Great fit! No major gaps found.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom: Actions */}
                <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <span className="text-sm text-gray-400">
                        Job ID: <span className="font-mono text-gray-500">{match.jobId.substring(0, 8)}...</span>
                     </span>

                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link 
                            to={`/candidate/job-match/${match.jobId}`} 
                            state={{ job: match }} // Pass data if needed
                            className="flex-1 sm:flex-none text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            View Details
                        </Link>
                        <button
                            onClick={handleApplyClick}
                            disabled={isApplied || isSubmitting}
                            className={`flex-1 sm:flex-none text-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                ${isApplied 
                                    ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                                    : isSubmitting 
                                        ? 'bg-indigo-400 cursor-wait' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }
                            `}
                        >
                            {isApplied ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Applied
                                </span>
                            ) : isSubmitting ? 'Applying...' : 'Apply Now'}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default JobMatches;
