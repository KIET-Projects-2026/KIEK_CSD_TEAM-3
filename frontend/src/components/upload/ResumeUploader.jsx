import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchResume } from '../../api/apiClient';

const ResumeUploader = () => {
  const navigate = useNavigate();

  // ✅ REQUIRED STATE
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ HANDLERS
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
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
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await matchResume(formData);

      setMessage({ type: 'success', text: 'Resume analyzed successfully' });
      setFile(null);

      navigate('/candidate/job-matches', {
        state: { matches: response.data.results }
      });

    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Resume analysis failed'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <p className="text-gray-600">Upload your resume</p>

          <label className="cursor-pointer text-indigo-600 font-medium">
            <span>Select a file</span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
          </label>

          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, TXT (max 5MB)
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded">
          <span className="text-sm">{file.name}</span>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
