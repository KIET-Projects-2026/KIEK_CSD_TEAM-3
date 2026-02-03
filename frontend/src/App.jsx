import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Background3D from './components/ui/Background3D';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import RoleAuthChoice from './pages/auth/RoleAuthChoice';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterJobDetail from './pages/recruiter/RecruiterJobDetail';
import RecruiterJobApplicants from './pages/recruiter/RecruiterJobApplicants';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import UploadResume from './pages/candidate/UploadResume';
import JobMatches from './pages/candidate/JobMatches';
import SpecificJobMatch from './pages/candidate/SpecificJobMatch';
import MatchedJobDetail from './pages/candidate/MatchedJobDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans text-text-primary">
          <Background3D />
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/role" element={<RoleAuthChoice />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Layout */}
            <Route element={<ProtectedLayout />}>
              
              {/* Recruiter Routes */}
              <Route element={<PrivateRoute requiredRole="recruiter" />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
                <Route path="/recruiter/jobs/:jobId" element={<RecruiterJobDetail />} />
                <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterJobApplicants />} />
                <Route path="/recruiter/profile" element={<RecruiterProfile />} />
              </Route>

              {/* Candidate Routes */}
              <Route element={<PrivateRoute requiredRole="candidate" />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="/candidate/profile" element={<CandidateProfile />} />
                <Route path="/candidate/upload-resume" element={<UploadResume />} />
                <Route path="/candidate/job-matches" element={<JobMatches />} />
                <Route path="/candidate/job-match/:jobId" element={<MatchedJobDetail />} />
                <Route path="/candidate/specific-match" element={<SpecificJobMatch />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

