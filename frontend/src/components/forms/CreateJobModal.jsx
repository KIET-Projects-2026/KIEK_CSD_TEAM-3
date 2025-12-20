import React, { useState } from 'react';
import { postJob } from '../../api/apiClient';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [jobForm, setJobForm] = useState({ title: '', description: '' });
  const [posting, setPosting] = useState(false);

  if (!isOpen) return null;

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
        await postJob(jobForm);
        setJobForm({ title: '', description: '' });
        onSuccess();
        // alert('Job posted successfully!'); // Optional: Let parent handle success msg or show toast
    } catch (error) {
        console.error(error);
        alert('Failed to post job');
    } finally {
        setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
            <form onSubmit={handlePostJob}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input 
                      type="text" 
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      value={jobForm.title}
                      onChange={e => setJobForm({...jobForm, title: e.target.value})}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea 
                      required
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      value={jobForm.description}
                      onChange={e => setJobForm({...jobForm, description: e.target.value})}
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={posting}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {posting ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CreateJobModal;
