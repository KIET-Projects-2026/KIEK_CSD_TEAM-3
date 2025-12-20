import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecruiterJobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={() => navigate('/recruiter/jobs')}
                className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
            >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Jobs
            </button>

            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Job Details (ID: {jobId})</h1>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                        onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Review Applicants
                    </button>
                </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <p className="text-gray-500">Details for job {jobId}.</p>
                {/* In a real app we would fetch and show Title/Description here. 
                    For now keeping it simple as per instructions asking to add the button. */}
            </div>
        </div>
    );
};

export default RecruiterJobDetail;
