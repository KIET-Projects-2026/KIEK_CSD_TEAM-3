import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Mail, Briefcase, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user?._id) {
         import('../../api/apiClient').then(({ getCandidateProfile }) => {
            getCandidateProfile(user._id)
                .then(res => updateUser(res.data))
                .catch(err => console.error(err));
         });
    }
  }, [user?._id, updateUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
                <div className="flex gap-3">
                   <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                   <Button onClick={handleSave}>Save</Button>
                </div>
            )}
        </div>

        <Card className="overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
             <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-4 rounded-full">
                     <User className="w-8 h-8 text-primary" />
                 </div>
                 <div>
                     <h3 className="text-xl font-semibold text-text-primary">Applicant Information</h3>
                     <p className="text-sm text-text-muted">Personal details and resume.</p>
                 </div>
             </div>
          </div>
          
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                    {isEditing ? (
                        <Input
                             name="name"
                             value={formData.name}
                             onChange={handleChange}
                             icon={<User className="w-4 h-4 text-gray-400" />}
                        />
                    ) : (
                        <p className="text-base text-text-primary font-medium flex items-center gap-2">
                             <User className="w-4 h-4 text-primary" /> {user?.name || 'Candidate Name'}
                        </p>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Email Address</label>
                    {isEditing ? (
                        <Input
                             name="email"
                             value={formData.email}
                             onChange={handleChange}
                             type="email"
                             icon={<Mail className="w-4 h-4 text-gray-400" />}
                        />
                    ) : (
                        <p className="text-base text-text-primary font-medium flex items-center gap-2">
                             <Mail className="w-4 h-4 text-primary" /> {user?.email || 'candidate@example.com'}
                        </p>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
                    <p className="text-base text-text-primary font-medium flex items-center gap-2">
                         <Briefcase className="w-4 h-4 text-primary" /> Candidate
                    </p>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Resume</label>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <Link to="/candidate/upload-resume" className="text-primary hover:text-primary-dark font-medium transition-colors">
                            Upload new resume
                        </Link>
                    </div>
                 </div>
             </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CandidateProfile;

