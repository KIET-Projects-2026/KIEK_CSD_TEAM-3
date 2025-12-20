import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecruiterJobs } from '../../api/apiClient';
import CreateJobModal from '../../components/forms/CreateJobModal';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ activeJobs: 0, newApps: 0 });
  const [showPostJob, setShowPostJob] = useState(false);

  // Fetch stats wrapper to re-use
  const fetchStats = () => {
    getRecruiterJobs()
        .then(res => {
            const jobs = res.data;
            const totalApps = jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
            setStats({ 
                activeJobs: jobs.length, 
                newApps: totalApps 
            });
        })
        .catch(err => console.error(err));
  };

  useEffect(() => {
      fetchStats();
  }, []);

  const handleJobPosted = () => {
      setShowPostJob(false);
      fetchStats();
      alert('Job posted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruiter Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Jobs */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.activeJobs}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/recruiter/jobs" className="font-medium text-indigo-700 hover:text-indigo-900">
                View all jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Candidates to Review */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.newApps}</div> 
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/recruiter/jobs" className="font-medium text-indigo-700 hover:text-indigo-900">
                Review candidates
              </Link>
            </div>
          </div>
        </div>
        
        {/* Card 3: Post Job Trigger */}
        <div 
            onClick={() => setShowPostJob(true)}
            className="bg-white overflow-hidden shadow rounded-lg flex flex-col justify-center items-center p-6 border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-gray-50 transition-colors cursor-pointer"
        >
           <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
           </svg>
           <span className="text-sm font-medium text-gray-600">Post a New Job</span>
        </div>

      </div>

      <CreateJobModal 
        isOpen={showPostJob} 
        onClose={() => setShowPostJob(false)} 
        onSuccess={handleJobPosted}
      />

    </div>
  );
};

export default RecruiterDashboard;
