import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, checkJobScore, applyToJob, getCandidateApplications } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const SpecificJobMatch = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());

    // Fetch Jobs and Applications on Mount
    useEffect(() => {
        Promise.all([
            getAllJobs(),
            user?._id ? getCandidateApplications() : Promise.resolve({ data: [] })
        ])
        .then(([jobsRes, appsRes]) => {
            setJobs(jobsRes.data);
            setFilteredJobs(jobsRes.data);
            
            // Assume appsRes.data is an array of application objects or strings.
            // Adjust based on actual API response structure. 
            // If it returns list of full applications, map to jobId.
            const jobIds = appsRes.data.map(app => 
                typeof app === 'string' ? app : (app.jobId || app.job?._id || app._id)
            );
            setAppliedJobIds(new Set(jobIds));
        })
        .catch(err => {
            console.error(err);
            setError('Failed to load data');
        });
    }, [user?._id]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = jobs.filter(job => 
            job.title.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term)
        );
        setFilteredJobs(filtered);
    }, [searchTerm, jobs]);

    const handleJobSelect = (job) => {
        setSelectedJob(job);
        setMatchResult(null);
        setResume(null);
        setError('');
        setSuccessMsg('');
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleCheckScore = async (e) => {
        e.preventDefault();
        if (!resume || !selectedJob) return;

        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('resume', resume);

        try {
            const res = await checkJobScore(selectedJob._id, formData);
            if (res.data.success) {
                setMatchResult(res.data);
            } else {
                setError('Failed to calculate score');
            }
        } catch (err) {
            console.error(err);
             setError(err.response?.data?.message || 'Error checking score');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!selectedJob || !matchResult) return;
        
        setLoading(true);
        try {
            const applicationData = {
                candidateId: user?._id,
                score: matchResult.score,
                matchingSkills: matchResult.matchingSkills,
                missingSkills: matchResult.missingSkills,
                source: 'specific_match'
            };

            await applyToJob(selectedJob._id, applicationData);
            
            // Optimistic update
            const newApplied = new Set(appliedJobIds);
            newApplied.add(selectedJob._id);
            setAppliedJobIds(newApplied);

            setSuccessMsg('Successfully applied!');
            // We can redirect or stay here to show "Applied" state
            // setTimeout(() => {
            //     navigate('/candidate/dashboard');
            // }, 2000);

        } catch (err) {
             console.error("Apply error:", err);
             // If error is "already applied", we can also update state to reflect truth
             if (err.response?.status === 400 && err.response?.data?.message?.includes('already')) {
                 const newApplied = new Set(appliedJobIds);
                 newApplied.add(selectedJob._id);
                 setAppliedJobIds(newApplied);
                 setError(''); // Clear error if we handled it by UI state
             } else {
                 setError(err.response?.data?.message || 'Error applying to job');
             }
        } finally {
             setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedJob(null);
        setMatchResult(null);
        setResume(null);
        setError('');
        setSuccessMsg('');
    };

    const isJobApplied = selectedJob && appliedJobIds.has(selectedJob._id);

    // --- Render Helpers ---

    const renderSearchBar = () => (
        <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-100 shadow-lg text-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder-gray-400 text-gray-800"
                placeholder="Search for roles (e.g. 'Frontend Developer')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );

    const renderJobCard = (job) => (
        <div key={job._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden cursor-pointer" onClick={() => handleJobSelect(job)}>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    {appliedJobIds.has(job._id) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                             Applied
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">{job.description}</p>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium text-indigo-600 group-hover:underline">View Details</span>
                    <svg className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Find Your <span className="text-indigo-600">Perfect Match</span>
                    </h1>
                    <p className="text-lg text-gray-500">AI-powered analysis to help you land the right job.</p>
                </div>

                {!selectedJob ? (
                    <>
                        {renderSearchBar()}
                        {filteredJobs.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {filteredJobs.map(job => renderJobCard(job))}
                            </div>
                        ) : (
                             <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white min-h-[600px] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
                        {/* Left Panel: Job Info */}
                        <div className="p-8 md:w-1/2 lg:w-2/5 bg-gray-50 border-r border-gray-100 flex flex-col">
                            <button onClick={handleCancel} className="mb-6 flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors w-fit">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Jobs
                            </button>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedJob?.title}</h2>
                            <div className="prose prose-sm text-gray-600 mb-8 overflow-y-auto max-h-[400px] custom-scrollbar">
                                <p>{selectedJob?.description}</p>
                                <h4 className="text-gray-900 font-semibold mt-4 mb-2">Requirements (Extracted)</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Experience with modern frontend frameworks</li>
                                    <li>Understanding of RESTful APIs</li>
                                    <li>Strong problem-solving skills</li>
                                </ul>
                            </div>

                            {!matchResult && (
                                <div className="mt-auto bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Analyze Resume Match
                                    </h4>
                                    <form onSubmit={handleCheckScore} className="space-y-4">
                                        <label className="block w-full cursor-pointer hover:bg-slate-50 transition-colors border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <span className="block text-sm font-medium text-gray-600 mb-1">{resume ? resume.name : "Upload Resume (PDF/DOCX)"}</span>
                                            <span className="block text-xs text-gray-400">Click to browse files</span>
                                            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={!resume || loading}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {loading && (
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {loading ? 'Analyzing with AI...' : 'Run Match Analysis'}
                                        </button>
                                    </form>
                                    {error && <p className="text-red-600 text-sm mt-3 bg-red-50 p-2 rounded">{error}</p>}
                                </div>
                            )}
                        </div>

                        {/* Right Panel: Analysis Result */}
                        <div className="p-8 md:w-1/2 lg:w-3/5 bg-white relative flex flex-col justify-center">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full opacity-50 pointer-events-none"></div>

                            {!matchResult ? (
                                <div className="flex flex-col items-center justify-center text-center h-full text-gray-400 p-8 space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                         <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                         </svg>
                                    </div>
                                    <p className="text-lg font-medium text-gray-500">Ready to analyze</p>
                                    <p className="max-w-xs text-sm">Upload your resume on the left to see how well you match this role.</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-lg mx-auto animate-in slide-in-from-right-4 duration-500">
                                     {successMsg ? (
                                         <div className="text-center py-12">
                                             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                 <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                 </svg>
                                             </div>
                                             <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                                             <p className="text-gray-500">You can continue analyzing other jobs.</p>
                                             <button 
                                                 onClick={handleCancel}
                                                 className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                                             >
                                                 Check Another Job
                                             </button>
                                         </div>
                                     ) : (
                                         <>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                                <span className="bg-indigo-600 w-1.5 h-6 rounded-full mr-3"></span>
                                                Analysis Result
                                            </h3>

                                            {/* Score Card */}
                                            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm mb-8 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-1">Match Score</p>
                                                    <p className="text-3xl font-extrabold text-indigo-600">{matchResult.score}%</p>
                                                </div>
                                                <div className="relative w-20 h-20">
                                                     <svg className="w-full h-full transform -rotate-90">
                                                        <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                                        <circle 
                                                            cx="40" 
                                                            cy="40" 
                                                            r="36" 
                                                            stroke="currentColor" 
                                                            strokeWidth="8" 
                                                            fill="transparent" 
                                                            strokeDasharray={226.2} 
                                                            strokeDashoffset={226.2 - (226.2 * matchResult.score) / 100} 
                                                            className="text-indigo-600 transition-all duration-1000 ease-out" 
                                                        />
                                                     </svg>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Matched Skills */}
                                                <div>
                                                    <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Matched Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {matchResult.matchingSkills?.length ? matchResult.matchingSkills.map((skill, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                                                {skill}
                                                            </span>
                                                        )) : <span className="text-sm text-gray-400 italic">No direct skill matches found.</span>}
                                                    </div>
                                                </div>

                                                {/* Missing Skills */}
                                                <div>
                                                    <h4 className="flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Missing Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {matchResult.missingSkills?.length ? matchResult.missingSkills.map((skill, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                                                                {skill}
                                                            </span>
                                                        )) : <span className="text-sm text-gray-400 italic">Great! No missing skills identified.</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-8 mt-auto">
                                                {isJobApplied ? (
                                                    <button 
                                                        disabled
                                                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-sm cursor-not-allowed text-lg flex justify-center items-center opacity-90"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Already Applied
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={handleApply}
                                                        disabled={loading}
                                                        className={`w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg flex justify-center items-center group
                                                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black text-white'}
                                                        `}
                                                    >
                                                        {loading ? 'Submitting...' : 'Apply for this Position'}
                                                        {!loading && (
                                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                                
                                                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                                            </div>
                                         </>
                                     )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecificJobMatch;
