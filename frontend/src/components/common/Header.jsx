import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { isAuthenticated, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
              ResumeAI
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                 {role === 'recruiter' ? (
                   <>
                     <Link to="/recruiter/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                     <Link to="/recruiter/jobs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Jobs</Link>
                     <Link to="/recruiter/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                   </>
                 ) : (
                   <>
                     <Link to="/candidate/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                     <Link to="/candidate/job-matches" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Matches</Link>
                     <Link to="/candidate/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                   </>
                 )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-4">
                
                <Link to="/register" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


/*text-indigo-600 hover:text-indigo-500 font-medium*/