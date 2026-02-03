import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCandidateApplications } from '../../api/apiClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, CheckCircle2, XCircle, FileText, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getCandidateApplications()
        .then(res => setApplications(res.data))
        .catch(err => console.error(err));
  }, []);

  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-8">Candidate Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Total Applications</p>
                        <p className="mt-1 text-3xl font-bold text-text-primary">{applications.length}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Accepted</p>
                        <p className="mt-1 text-3xl font-bold text-text-primary">{acceptedCount}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                         <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-red-500 hover:-translate-y-1 transition-transform">
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Rejected</p>
                        <p className="mt-1 text-3xl font-bold text-text-primary">{rejectedCount}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                         <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
                 <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> 
                    Resume Status
                 </h3>
                 <p className="mt-2 text-sm text-text-muted">Upload a new version of your resume to get better job matches.</p>
                 <div className="mt-4">
                     <Link to="/candidate/upload-resume">
                         <Button variant="secondary" className="w-full sm:w-auto">Update Resume</Button>
                     </Link>
                 </div>
            </Card>

            <Card className="p-6">
                 <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Search className="w-5 h-5 text-accent" />
                    Job Matches
                 </h3>
                 <p className="mt-2 text-sm text-text-muted">You have matches based on your skills!</p>
                 <div className="mt-4 flex gap-3">
                      <Link to="/candidate/job-matches">
                          <Button className="w-full sm:w-auto">View Matches</Button>
                      </Link>
                      <Link to="/candidate/specific-match">
                          <Button variant="outline" className="w-full sm:w-auto">Specific Match</Button>
                      </Link>
                 </div>
            </Card>
        </div>

        <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">Application History</h2>
            <Card className="overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No applications yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <li key={app._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/5 p-2 rounded-lg">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">{app.jobId?.title || 'Unknown Job'}</p>
                                            <p className="text-xs text-text-muted">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            Score: {Math.round(app.score)}%
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                            app.status === 'accepted' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                            'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}>
                                            {app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidateDashboard;

