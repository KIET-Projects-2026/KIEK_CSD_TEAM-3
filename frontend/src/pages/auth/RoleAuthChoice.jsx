import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const RoleAuthChoice = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'candidate';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const handleAnalytics = (action) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'auth_choice',
        role,
        action,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Continue as {roleLabel}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please log in or create a new account to proceed.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
          <Link
            to={`/login?role=${role}`}
            onClick={() => handleAnalytics('login')}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </Link>
          <Link
            to={`/register?role=${role}`}
            onClick={() => handleAnalytics('register')}
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleAuthChoice;
