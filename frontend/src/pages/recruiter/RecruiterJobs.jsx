import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecruiterJobs, deleteRecruiterJob } from '../../api/apiClient';
import CreateJobModal from '../../components/forms/CreateJobModal';
import { 
    Users, 
    MoreHorizontal, 
    Sparkles, 
    Briefcase, 
    TrendingUp, 
    AlertCircle, 
    Search,
    Calendar,
    ChevronRight,
    Megaphone
} from 'lucide-react';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);

  // Mock data generator to enhance the UI until backend catches up
  const augmentJobData = (job) => {
      const applicantCount = job.applicationCount || 0;
      
      // Simulate status based on applicants or random for demo
      let status = 'Active';
      if (applicantCount > 50) status = 'Closing Soon';
      if (applicantCount === 0 && Math.random() > 0.8) status = 'Draft';

      // Simulate AI stats
      const strongMatches = Math.floor(applicantCount * (0.2 + Math.random() * 0.3));
      
      // Simulate Insight
      let aiInsight = "Waiting for more data...";
      if (applicantCount > 20) aiInsight = "High candidate quality detected.";
      else if (applicantCount > 5) aiInsight = "Consider boosting this post.";
      else if (applicantCount === 0) aiInsight = "Try refining your skills section.";

      return { ...job, status, strongMatches, aiInsight };
  };

  const fetchJobs = () => {
     getRecruiterJobs()
      .then(res => {
          const augmented = res.data.map(augmentJobData);
          setJobs(augmented);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobPosted = () => {
      setShowPostJob(false);
      fetchJobs();
      alert('Job posted successfully!');
  };

  const handleDeleteJob = async (jobId) => {
      if (window.confirm("Are you sure you want to delete this job?")) {
          try {
              await deleteRecruiterJob(jobId);
              setJobs(jobs.filter(job => job._id !== jobId));
          } catch (error) {
              console.error("Failed to delete job:", error);
              alert("Failed to delete job");
          }
      }
  };

  const handlePromote = () => {
      alert("Promotion feature coming soon! (This would integrate with job boards)");
  };

  // UI Helpers
  const getStatusColor = (status) => {
      switch(status) {
          case 'Active': return 'bg-green-100 text-green-700 border-green-200';
          case 'Closing Soon': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'Draft': return 'bg-gray-100 text-gray-600 border-gray-200';
          default: return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Training & Placements</h2>
            <p className="mt-2 text-gray-500">Manage your active listings and track candidate performance.</p>
        </div>
        <div className="mt-4 md:mt-0">
            <button
            onClick={() => setShowPostJob(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
            <Briefcase className="w-4 h-4" />
            Post New Job
            </button>
        </div>
      </div>

      {/* Stats Overview (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
               <div className="p-3 bg-blue-50 rounded-xl mr-4">
                   <Briefcase className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                   <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                   <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'Active').length}</p>
               </div>
           </div>
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
               <div className="p-3 bg-purple-50 rounded-xl mr-4">
                   <Users className="w-6 h-6 text-purple-600" />
               </div>
               <div>
                   <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                   <p className="text-2xl font-bold text-gray-900">{jobs.reduce((acc, curr) => acc + (curr.applicationCount || 0), 0)}</p>
               </div>
           </div>
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
               <div className="p-3 bg-green-50 rounded-xl mr-4">
                   <TrendingUp className="w-6 h-6 text-green-600" />
               </div>
               <div>
                   <p className="text-sm font-medium text-gray-500">Avg. Match Rate</p>
                   <p className="text-2xl font-bold text-gray-900">76%</p>
               </div>
           </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first job listing to attract top talent.</p>
                    <button
                        onClick={() => setShowPostJob(true)}
                        className="inline-flex items-center text-indigo-600 font-semibold hover:underline"
                    >
                        Create Job Posting &rarr;
                    </button>
                </div>
            ) : (
                jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative overflow-hidden">
                        
                        {/* Card Header */}
                        <div className="p-6 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                                <div className="relative group/menu">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    {/* Dropdown Menu (Simplified) */}
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover/menu:block z-20">
                                        <button onClick={() => handleDeleteJob(job._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
                                <Link to={`/recruiter/jobs/${job._id}`}>{job.title}</Link>
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <span>{new Date().toLocaleDateString()}</span>
                                <span className="mx-2">•</span>
                                <span>Full-time</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 h-10">{job.description}</p>
                        </div>

                        {/* Metrics Section */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-b border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{job.applicationCount || 0}</p>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center mt-1">
                                    <Users className="w-3 h-3 mr-1" />
                                    Applicants
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-indigo-600">{job.strongMatches || 0}</p>
                                <p className="text-xs font-medium text-indigo-600/80 uppercase tracking-wide flex items-center mt-1">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Strong Match
                                </p>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-white">
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-purple-700 font-medium leading-relaxed">
                                    AI Insight: <span className="font-normal text-purple-600">{job.aiInsight}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 pt-4 mt-auto grid grid-cols-2 gap-3">
                            {(job.applicationCount || 0) > 0 ? (
                                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="col-span-1">
                                    <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex justify-center items-center">
                                        View CVs
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </Link>
                            ) : (
                                <button 
                                    onClick={handlePromote}
                                    className="col-span-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex justify-center items-center"
                                >
                                    <Megaphone className="w-4 h-4 mr-2" />
                                    Promote
                                </button>
                            )}
                            
                            <Link to={`/recruiter/jobs/${job._id}`} className="col-span-1">
                                <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg text-sm font-medium transition-all">
                                    Manage
                                </button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
      </div>
      
      <CreateJobModal 
        isOpen={showPostJob} 
        onClose={() => setShowPostJob(false)} 
        onSuccess={handleJobPosted}
      />
    </div>
  );
};

export default RecruiterJobs;
