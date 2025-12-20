import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCandidateApplications } from '../../api/apiClient';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getCandidateApplications()
        .then(res => setApplications(res.data))
        .catch(err => console.error(err));
  }, []);

  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{applications.length}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
              <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{acceptedCount}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-red-500">
              <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{rejectedCount}</dd>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ... Keep existing Action Cards (Upload Resume, Job Matches, Profile) ... */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                   <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Your Resume</h3>
                   <div className="mt-2 text-max-w-xl text-sm text-gray-500">
                       <p>Upload a new version of your resume to get better job matches.</p>
                   </div>
                   <div className="mt-5">
                       <Link to="/candidate/upload-resume" className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                           Update Resume
                       </Link>
                   </div>
              </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                   <h3 className="text-lg leading-6 font-medium text-gray-900">Job Matches</h3>
                   <div className="mt-2 text-max-w-xl text-sm text-gray-500">
                       <p>You have new job matches based on your skills!</p>
                   </div>
                   <div className="mt-5">
                       <Link to="/candidate/job-matches" className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                           View Matches
                       </Link>
                   </div>
              </div>
          </div>
      </div>

      <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Application History</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {applications.length === 0 ? (
                <p className="px-4 py-4 text-gray-500 text-sm">No applications yet.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {applications.map((app) => (
                        <li key={app._id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">{app.jobId?.title || 'Unknown Job'}</p>
                                <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Score: {Math.round(app.score)}%
                                    </p>
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : 'Pending'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
