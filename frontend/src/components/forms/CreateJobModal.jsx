import React, { useState } from 'react';
import { postJob } from '../../api/apiClient';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { X, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateJobModal = ({ isOpen, onClose, onSuccess }) => {
  const [jobForm, setJobForm] = useState({ title: '', description: '' });
  const [posting, setPosting] = useState(false);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
        await postJob(jobForm);
        setJobForm({ title: '', description: '' });
        onSuccess();
    } catch (error) {
        console.error(error);
        alert('Failed to post job');
    } finally {
        setPosting(false);
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg z-10"
                >
                    <Card className="overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-text-primary">Post a New Job</h2>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePostJob} className="p-6 space-y-5">
                            <Input 
                                label="Job Title"
                                icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                                placeholder="e.g. Senior Frontend Engineer"
                                required
                                value={jobForm.title}
                                onChange={e => setJobForm({...jobForm, title: e.target.value})}
                            />

                            {/* New Fields Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Location"
                                    placeholder="e.g. Remote, Bangalore"
                                    value={jobForm.location || ''}
                                    onChange={e => setJobForm({...jobForm, location: e.target.value})}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5 ml-1">Job Type</label>
                                    <select 
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-2.5 text-sm focus:bg-white focus:border-primary focus:ring-primary transition-all"
                                        value={jobForm.jobType || 'Full-time'}
                                        onChange={e => setJobForm({...jobForm, jobType: e.target.value})}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Min Experience (Yrs)"
                                    type="number"
                                    min="0"
                                    value={jobForm.minExperience || ''}
                                    onChange={e => setJobForm({...jobForm, minExperience: Number(e.target.value)})}
                                />
                                <Input 
                                    label="Max Experience (Yrs)"
                                    type="number"
                                    min="0"
                                    value={jobForm.maxExperience || ''}
                                    onChange={e => setJobForm({...jobForm, maxExperience: Number(e.target.value)})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5 ml-1">Education</label>
                                <select 
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-2.5 text-sm focus:bg-white focus:border-primary focus:ring-primary transition-all"
                                    value={jobForm.education || 'Any Degree'}
                                    onChange={e => setJobForm({...jobForm, education: e.target.value})}
                                >
                                    <option value="Any Degree">Any Degree</option>
                                    <option value="B.Tech">B.Tech</option>
                                    <option value="MCA">MCA</option>
                                    <option value="MBA">MBA</option>
                                    <option value="M.Tech">M.Tech</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>

                            <Input 
                                label="Required Skills (Comma separated)"
                                placeholder="e.g. React, Node.js, Python"
                                value={jobForm.requiredSkillsString || ''}
                                onChange={e => setJobForm({
                                    ...jobForm, 
                                    requiredSkillsString: e.target.value,
                                    requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                })}
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5 ml-1">
                                    Job Description
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <textarea 
                                        required
                                        rows={4}
                                        className="block w-full rounded-xl border-gray-200 pl-10 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-primary sm:text-sm transition-all duration-200"
                                        placeholder="Describe the role, responsibilities..."
                                        value={jobForm.description}
                                        onChange={e => setJobForm({...jobForm, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button 
                                    type="button" 
                                    variant="ghost"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    isLoading={posting}
                                    disabled={!jobForm.title || !jobForm.description}
                                >
                                    Post Job
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};

export default CreateJobModal;

