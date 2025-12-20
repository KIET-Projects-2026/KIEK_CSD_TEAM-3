import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Changed imports
import { applyToJob } from '../../api/apiClient'; // Import applyToJob API

const JobMatches = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For redirect if needed or refresh
  const [jobs, setJobs] = useState([]);
  const [applying, setApplying] = useState({}); // Track applying state per job ID

  useEffect(() => {
    if (location.state?.matches) {
        setJobs(location.state.matches);
    }
  }, [location.state]);

  const handleApply = async (match) => {
      setApplying(prev => ({ ...prev, [match.jobId]: true }));
      try {
          const payload = {
              score: match.score,
              matchingSkills: match.matchingSkills,
              missingSkills: match.missingSkills
          };
          await applyToJob(match.jobId, payload);
          
          // Update local state to show applied
          setJobs(prevJobs => prevJobs.map(job => 
              job.jobId === match.jobId ? { ...job, applied: true } : job
          ));
          
          // No alert, just UI update
      } catch (error) {
          console.error("Application failed", error);
          alert("Failed to apply. Please try again.");
      } finally {
          setApplying(prev => ({ ...prev, [match.jobId]: false }));
      }
  };

  if (!location.state?.matches) {
      return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">No matches found</h1>
              <p className="text-gray-600 mb-4">Please upload your resume to see job matches.</p>
              <Link to="/candidate/upload-resume" className="text-indigo-600 hover:text-indigo-500">
                  Upload Resume
              </Link>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Top Job Matches</h1>
      <div className="space-y-6">
        {jobs.map((match) => (
            <div key={match.jobId} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                             <h3 className="text-lg leading-6 font-medium text-gray-900">{match.title || 'Job Match'}</h3>
                             <p className="max-w-xl text-sm text-gray-500">{match.description ? match.description.substring(0, 100) + '...' : ''}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-indigo-600">{Math.round(match.score)}%</span>
                            <span className="text-xs text-gray-500">Match Score</span>
                        </div>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Job ID: {match.jobId}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                   <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                       <div className="sm:col-span-1">
                           <dt className="text-sm font-medium text-gray-500">Matching Skills</dt>
                           <dd className="mt-1 text-sm text-gray-900">
                               {match.matchingSkills && match.matchingSkills.length > 0 ? (
                                   <div className="flex flex-wrap gap-2">
                                       {match.matchingSkills.map(skill => (
                                           <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                               {skill}
                                           </span>
                                       ))}
                                   </div>
                               ) : 'None'}
                           </dd>
                       </div>
                       <div className="sm:col-span-1">
                           <dt className="text-sm font-medium text-gray-500">Missing Skills</dt>
                           <dd className="mt-1 text-sm text-gray-900">
                                {match.missingSkills && match.missingSkills.length > 0 ? (
                                   <div className="flex flex-wrap gap-2">
                                       {match.missingSkills.map(skill => (
                                           <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                               {skill}
                                           </span>
                                       ))}
                                   </div>
                               ) : 'None'}
                           </dd>
                       </div>
                   </dl>
                   <div className="mt-4">
                        {match.applied ? (
                            <button disabled className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 cursor-not-allowed">
                                Applied
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleApply(match)}
                                disabled={applying[match.jobId]}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                {applying[match.jobId] ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                   </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatches;
