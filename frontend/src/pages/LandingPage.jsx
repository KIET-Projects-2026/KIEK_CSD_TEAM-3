import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/auth/role?role=${role}`);
  };


  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI-Powered Resume Screening
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Streamline your hiring process with intelligent candidate matching.
              Join as a recruiter to find talent or as a candidate to find your dream job.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => window.location.href = '/auth/role?role=candidate'}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                I'm a Candidate
              </button>
              <button
                onClick={() => window.location.href = '/auth/role?role=recruiter'}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                I'm a Recruiter
              </button>
            </div>
            <div className="mt-8">
                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Already have an account? Log in <span aria-hidden="true">→</span>
                </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
