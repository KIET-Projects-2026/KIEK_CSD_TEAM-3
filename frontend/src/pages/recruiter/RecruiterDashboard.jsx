import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecruiterJobs, getJobApplications } from '../../api/apiClient';
import CreateJobModal from '../../components/forms/CreateJobModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, Users, PlusCircle, ChevronRight, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ activeJobs: 0, newApps: 0 });
  const [activeJobs, setActiveJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [showPostJob, setShowPostJob] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to format date
  const formatDate = (dateString) => {
      if (!dateString) return 'Just now';
      return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const fetchDashboardData = async () => {
    try {
        const jobsRes = await getRecruiterJobs();
        const jobs = jobsRes.data;
        
        // 1. Calculate Stats
        const totalApps = jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
        setStats({ 
            activeJobs: jobs.length, 
            newApps: totalApps 
        });

        // 2. Set Active Jobs (Show top 4)
        // Assuming jobs comes sorted by newest, otherwise we'd sort here
        setActiveJobs(jobs.slice(0, 4));

        // 3. Aggregate Recent Candidates
        // We fetch candidates from the top 3 jobs to populate the "Recent Activity" feed
        const recentJobIds = jobs.slice(0, 3).map(j => ({ id: j._id, title: j.title }));
        const candidatesPromises = recentJobIds.map(job => 
            getJobApplications(job.id)
                .then(res => res.data.map(app => ({ 
                    ...app, 
                    appliedJobTitle: job.title,
                    // Map nested candidate details to top level for UI
                    name: app.candidateId?.name || 'Unknown Candidate',
                    // Map score to resumeScore as expected by UI
                    resumeScore: app.score
                })))
                .catch(() => []) 
        );

        const allCandidates = (await Promise.all(candidatesPromises)).flat();
        // Sort by "appliedAt" if available, or just take first 5
        setRecentCandidates(allCandidates.slice(0, 5));
        
        setLoading(false);
    } catch (err) {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleJobPosted = () => {
      setShowPostJob(false);
      fetchDashboardData();
      alert('Job posted successfully!');
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'Accepted': return 'text-green-600 bg-green-50';
          case 'Rejected': return 'text-red-600 bg-red-50';
          default: return 'text-amber-600 bg-amber-50';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold text-text-primary">Recruiter Dashboard</h1>
             <Button onClick={() => setShowPostJob(true)}>
                 <PlusCircle className="w-4 h-4 mr-2" /> Post Job
             </Button>
        </div>
      
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-l-4 border-l-primary relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Active Jobs</p>
                        <p className="mt-2 text-4xl font-bold text-text-primary">{stats.activeJobs}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-xl">
                         <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to="/recruiter/jobs" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center">
                        View all jobs <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-secondary relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Total Applicants</p>
                        <p className="mt-2 text-4xl font-bold text-text-primary">{stats.newApps}</p>
                    </div>
                    <div className="bg-secondary/10 p-3 rounded-xl">
                         <Users className="h-8 w-8 text-secondary" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to="/recruiter/jobs" className="text-sm font-medium text-secondary hover:text-blue-700 transition-colors flex items-center">
                         Review candidates <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </Card>
            
            <Card 
                onClick={() => setShowPostJob(true)}
                className="flex flex-col justify-center items-center p-6 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50/50 transition-all cursor-pointer group"
            >
               <div className="bg-gray-50 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                   <PlusCircle className="h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
               </div>
               <span className="mt-3 text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">Create New Job Listing</span>
            </Card>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Job Listings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary">Recent Job Listings</h2>
                    <Link to="/recruiter/jobs" className="text-sm text-primary hover:underline">View All</Link>
                </div>
                {activeJobs.length === 0 ? (
                    <Card className="p-6 text-center text-text-muted bg-gray-50 border-gray-100">
                        No active jobs found. Post a job to get started.
                    </Card>
                ) : (
                    activeJobs.map(job => (
                        <Card key={job._id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="font-semibold text-text-primary">{job.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                                    <span className="text-xs text-text-muted">• {formatDate()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-text-muted">
                                    {job.applicationCount || 0} <span className="text-xs font-normal">Applicants</span>
                                </span>
                                <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                                    <Button size="sm" variant="outline">View Applicants</Button>
                                </Link>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Recent Candidates Activity */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-primary">Recent Candidates</h2>
                    <span className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">Latest Activity</span>
                </div>
                {recentCandidates.length === 0 && !loading ? (
                    <Card className="p-6 text-center text-text-muted bg-gray-50 border-gray-100">
                         No candidates have applied to potential jobs yet.
                    </Card>
                ) : (
                    <Card className="divide-y divide-gray-100">
                        {recentCandidates.map((candidate, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold">
                                        {candidate.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-text-primary">{candidate.name || 'Unknown Candidate'}</p>
                                        <p className="text-xs text-text-muted">Applied for <span className="font-medium text-primary">{candidate.appliedJobTitle}</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {candidate.resumeScore ? (
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-bold ${candidate.resumeScore > 75 ? 'text-green-600' : 'text-amber-600'}`}>
                                                {candidate.resumeScore}% Match
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${getStatusColor(candidate.status)}`}>
                                                {candidate.status || 'Pending'}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-text-muted flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Processing
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                         {recentCandidates.length === 0 && loading && (
                            <div className="p-4 text-center text-sm text-gray-400">Loading recent candidates...</div>
                        )}
                    </Card>
                )}
            </div>
        </div>

        <CreateJobModal 
            isOpen={showPostJob} 
            onClose={() => setShowPostJob(false)} 
            onSuccess={handleJobPosted}
        />
      </motion.div>
    </div>
  );
};

export default RecruiterDashboard;

