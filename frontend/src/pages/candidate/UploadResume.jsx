import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { matchResume } from '../../api/apiClient';

const UploadResume = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    // --- Handlers ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
             setFile(e.target.files[0]);
             setMessage(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);
        
        const formData = new FormData();
        formData.append('resume', file);

        try {
            // Simulate progress if needed, but for now just await response
            const response = await matchResume(formData);
            
            setMessage({ type: 'success', text: 'Analysis Complete!' });
            
            // Short delay to show success state before redirecting
            setTimeout(() => {
                 navigate('/candidate/job-matches', {
                    state: { matches: response.data.results }
                });
            }, 1000);

        } catch (error) {
            console.error(error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Resume analysis failed. Please try again.'
            });
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
                        Upload Your Resume
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Let our AI analyze your skills and experience to find the perfect job opportunities for you.
                    </p>
                </div>

                {/* Steps Visualizer */}
                <div className="relative mb-12 max-w-3xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                    <div className="flex justify-between w-full">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center bg-gray-50 px-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm ring-4 ring-gray-50 shadow-sm">
                                1
                            </div>
                            <span className="mt-2 text-sm font-medium text-indigo-700">Upload</span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center bg-gray-50 px-2">
                             <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ring-4 ring-gray-50 shadow-sm transition-colors ${uploading ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                2
                            </div>
                            <span className={`mt-2 text-sm font-medium transition-colors ${uploading ? 'text-indigo-700' : 'text-gray-500'}`}>AI Analysis</span>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center bg-gray-50 px-2">
                             <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ring-4 ring-gray-50 shadow-sm transition-colors ${message?.type === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                3
                            </div>
                             <span className={`mt-2 text-sm font-medium transition-colors ${message?.type === 'success' ? 'text-green-600' : 'text-gray-500'}`}>Job Match</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 sm:p-12">
                        
                        {/* Upload Zone */}
                        <div 
                            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-in-out cursor-pointer group
                                ${isDragOver 
                                    ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                                    : file 
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                }
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                                disabled={uploading}
                            />
                            
                            <div className="space-y-4 pointer-events-none relative z-0">
                                {file ? (
                                    <div className="animate-in zoom-in duration-300">
                                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                             <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                                        <p className="text-xs text-indigo-600 font-medium mt-2">Click or drag to replace</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragOver ? 'bg-indigo-200' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
                                            <svg className={`w-10 h-10 transition-colors ${isDragOver ? 'text-indigo-700' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-lg font-medium text-indigo-600">Click to upload</span>
                                            <span className="text-lg text-gray-500"> or drag and drop</span>
                                        </div>
                                        <p className="text-sm text-gray-400">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                         {/* Feedback States */}
                         {uploading && (
                            <div className="mt-8">
                                <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                                    <span>Analyzing Resume...</span>
                                    <span>75%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-indigo-600 h-2.5 rounded-full animate-progress-indeterminate w-3/4"></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Identifying skills, experience, and qualifications.</p>
                            </div>
                         )}

                         {message?.type === 'error' && (
                             <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
                                 <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                                 <span className="text-sm text-red-700 font-medium">{message.text}</span>
                             </div>
                         )}

                         {message?.type === 'success' && (
                             <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                                 <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                 </svg>
                                 <span className="text-green-800 font-bold">Success! Redirecting to your matches...</span>
                             </div>
                         )}

                        {/* Actions */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Analyze & Match
                                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                         <div className="mt-6 text-center">
                            <Link to="/candidate/specific-match" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                                Skip for now <span aria-hidden="true">&rarr;</span> Check Specific Job
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadResume;
