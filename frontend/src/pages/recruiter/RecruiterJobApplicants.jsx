import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobApplications, updateApplicationStatus } from '../../api/apiClient';

const RecruiterJobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = () => {
        getJobApplications(jobId)
            .then(res => {
                const mapped = res.data.map(app => ({
                    id: app._id,
                    name: app.candidateId?.name || 'Unknown Candidate',
                    email: app.candidateId?.email || 'N/A',
                    matchScore: Math.round(app.score),
                    matchingSkills: app.matchingSkills || [],
                    missingSkills: app.missingSkills || [],
                    status: app.status || 'pending',
                    appliedDate: new Date(app.appliedAt).toLocaleDateString()
                }));
                setCandidates(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    const handleStatusUpdate = async (appId, status) => {
        try {
            await updateApplicationStatus(appId, status);
            // Update local state without full refetch if possible, or just refetch
            setCandidates(prev => prev.map(c => 
                c.id === appId ? { ...c, status: status } : c
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading applicants...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
            >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Job Details
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Applicants</h1>

            {candidates.length === 0 ? (
                <p className="text-gray-500">No applicants yet.</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {candidates.map((candidate) => (
                            <li key={candidate.id} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                                        <div className="text-sm text-gray-500">{candidate.email}</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            candidate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                        </span>
                                        <span className="text-sm text-gray-500 mt-1">Applied: {candidate.appliedDate}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Match Score</h4>
                                        <div className="flex items-center">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
                                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${candidate.matchScore}%` }}></div>
                                            </div>
                                            <span className="text-sm font-bold text-indigo-600">{candidate.matchScore}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Spacer */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                     <div>
                                         <h4 className="text-sm font-medium text-gray-500 mb-2">Matching Skills</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {candidate.matchingSkills.map((skill, idx) => (
                                                 <span key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium border border-green-200">
                                                     {skill}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <h4 className="text-sm font-medium text-gray-500 mb-2">Missing Skills</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {candidate.missingSkills.map((skill, idx) => (
                                                 <span key={idx} className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium border border-red-200">
                                                     {skill}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                </div>

                                <div className="flex space-x-3 justify-end border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => handleStatusUpdate(candidate.id, 'accept')}
                                        disabled={candidate.status !== 'pending'}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(candidate.id, 'reject')}
                                        disabled={candidate.status !== 'pending'}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecruiterJobApplicants;
