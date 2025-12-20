import React from 'react';

const RoleSelector = ({ selectedRole, onSelect }) => {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <button
        type="button"
        onClick={() => onSelect('candidate')}
        className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
          selectedRole === 'candidate'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
            : 'border-gray-200 hover:border-indigo-300 text-gray-600'
        }`}
      >
        I am a Candidate
      </button>
      <button
        type="button"
        onClick={() => onSelect('recruiter')}
        className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
          selectedRole === 'recruiter'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
            : 'border-gray-200 hover:border-indigo-300 text-gray-600'
        }`}
      >
        I am a Recruiter
      </button>
    </div>
  );
};

export default RoleSelector;
