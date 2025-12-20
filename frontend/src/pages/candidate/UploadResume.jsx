import React from 'react';
import ResumeUploader from '../../components/upload/ResumeUploader';

const UploadResume = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
            <p className="mt-2 text-gray-600">We analyze your resume to find the best job matches for you.</p>
        </div>
      <ResumeUploader />
    </div>
  );
};

export default UploadResume;
