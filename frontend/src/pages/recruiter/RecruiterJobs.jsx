import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecruiterJobs, deleteRecruiterJob } from '../../api/apiClient';
import CreateJobModal from '../../components/forms/CreateJobModal';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);

  const fetchJobs = () => {
     getRecruiterJobs()
      .then(res => {
          setJobs(res.data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobPosted = () => {
      setShowPostJob(false);
      fetchJobs();
      alert('Job posted successfully!');
  };

  const handleDeleteJob = async (jobId) => {
      if (window.confirm("Are you sure you want to delete this job? This action cannot be undone and will remove all associated applications.")) {
          try {
              await deleteRecruiterJob(jobId);
              setJobs(jobs.filter(job => job._id !== jobId));
              // alert("Job deleted successfully"); // Optional
          } catch (error) {
              console.error("Failed to delete job:", error);
              alert(error.response?.data?.message || "Failed to delete job");
          }
      }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Your Job Postings
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          onClick={() => setShowPostJob(true)}
          className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Job
        </button>
      </div>
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Active Listings</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet.</p>
            ) : (
                <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 mr-4">
                                <Link to={`/recruiter/jobs/${job._id}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-900">{job.title}</Link>
                                <p className="text-sm text-gray-600 mt-1">{job.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {job.applicationCount || 0} Applicants
                                </span>
                                <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="text-sm text-red-600 hover:text-red-900 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}
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

export default RecruiterJobs;
