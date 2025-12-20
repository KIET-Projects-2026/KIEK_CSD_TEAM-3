import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import PrivateRoute from './components/common/PrivateRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import RoleAuthChoice from './pages/auth/RoleAuthChoice';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterJobDetail from './pages/recruiter/RecruiterJobDetail';
import RecruiterJobApplicants from './pages/recruiter/RecruiterJobApplicants'; // Import
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import UploadResume from './pages/candidate/UploadResume';
import JobMatches from './pages/candidate/JobMatches';
import SpecificJobMatch from './pages/candidate/SpecificJobMatch';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/role" element={<RoleAuthChoice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Recruiter Protected Routes */}
            <Route element={<PrivateRoute requiredRole="recruiter" />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
              <Route path="/recruiter/jobs/:jobId" element={<RecruiterJobDetail />} />
              <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterJobApplicants />} /> {/* New Route */}
              <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            </Route>

            {/* Candidate Protected Routes */}
            <Route element={<PrivateRoute requiredRole="candidate" />}>
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate/profile" element={<CandidateProfile />} />
              <Route path="/candidate/upload-resume" element={<UploadResume />} />
              <Route path="/candidate/job-matches" element={<JobMatches />} />
              <Route path="/candidate/specific-match" element={<SpecificJobMatch />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
