import React from 'react';

const JobList = ({ jobs, onApply }) => {
  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500 text-center py-8">No jobs found.</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.company} • {job.location}</p>
          <p className="mt-3 text-gray-500 text-sm line-clamp-2">{job.description}</p>
          <div className="mt-4 flex justify-between items-center">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
               {job.type}
             </span>
             {onApply && (
                <button
                  onClick={() => onApply(job.id)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Apply Now &rarr;
                </button>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;
