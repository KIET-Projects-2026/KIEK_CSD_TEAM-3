import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, checkJobScore, applyToJob } from '../../api/apiClient';

const SpecificJobMatch = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all jobs
        getAllJobs()
            .then(res => {
                setJobs(res.data);
                setFilteredJobs(res.data);
            })
            .catch(err => setError('Failed to load jobs'));
    }, []);

    useEffect(() => {
        // Filter jobs based on search term
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
                score: matchResult.score,
                matchingSkills: matchResult.matchingSkills,
                missingSkills: matchResult.missingSkills,
                source: 'specific_match'
            };

            await applyToJob(selectedJob._id, applicationData);
            setSuccessMsg('Successfully applied!');
            setTimeout(() => {
                navigate('/candidate/dashboard');
            }, 1500);

        } catch (err) {
             setError(err.response?.data?.message || 'Error applying to job');
             setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedJob(null);
        setMatchResult(null);
        setResume(null);
        setError('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Specific Job Match</h1>

            {!selectedJob ? (
                <>
                    <div className="mb-6">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Jobs</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search by job title or description"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.length > 0 ? filteredJobs.map(job => (
                             <div key={job._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                                <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-sm text-gray-500 flex-grow mb-4 line-clamp-3">{job.description}</p>
                                    <button
                                        onClick={() => handleJobSelect(job)}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        Select Job
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 col-span-full text-center py-8">No jobs found matching your search.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl leading-6 font-medium text-gray-900">{selectedJob.title}</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">{selectedJob.description}</p>
                            </div>
                             {!matchResult && (
                                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                         </div>

                         {error && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {successMsg && (
                             <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">{successMsg}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!matchResult ? (
                            <form onSubmit={handleCheckScore} className="mt-5 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF, DOC, DOCX)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                                        </div>
                                    </div>
                                    {resume && <p className="mt-2 text-sm text-gray-600">Selected file: {resume.name}</p>}
                                </div>

                                <div className="flex justify-end space-x-3">
                                     <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!resume || loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                                    >
                                        {loading ? 'Analyzing...' : 'Analyze Match'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-4">Match Analysis</h4>
                                
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="text-4xl font-bold text-indigo-600 mr-4">{matchResult.score}%</div>
                                        <div className="text-gray-700 font-medium">Match Score</div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-semibold text-green-700 mb-2">Matching Skills</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {matchResult.matchingSkills.length > 0 ? matchResult.matchingSkills.map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{skill}</span>
                                                )) : <span className="text-sm text-gray-500">None</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-red-700 mb-2">Missing Skills</h5>
                                             <div className="flex flex-wrap gap-2">
                                                {matchResult.missingSkills.length > 0 ? matchResult.missingSkills.map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{skill}</span>
                                                )) : <span className="text-sm text-gray-500">None</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-32"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-32"
                                    >
                                        {loading ? 'Applying...' : 'Apply Now'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecificJobMatch;
