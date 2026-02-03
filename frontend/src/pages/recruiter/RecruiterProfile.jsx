import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { Briefcase, Mail, Building, User } from 'lucide-react';
import { motion } from 'framer-motion';

const RecruiterProfile = () => {
    const { user, updateUser } = useAuth();
    
    React.useEffect(() => {
        if (user?._id) {
            import('../../api/apiClient').then(({ getRecruiterProfile }) => { 
                getRecruiterProfile(user._id)
                    .then(res => updateUser(res.data))
                    .catch(err => console.error(err));
            });
        }
    }, [user?._id, updateUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
          <div className="mb-6">
             <h1 className="text-3xl font-bold text-text-primary">Recruiter Profile</h1>
          </div>

          <Card className="overflow-hidden">
             <div className="px-6 py-6 border-b border-gray-100">
                 <div className="flex items-center gap-4">
                     <div className="bg-secondary/10 p-4 rounded-full">
                         <Building className="w-8 h-8 text-secondary" />
                     </div>
                     <div>
                         <h3 className="text-xl font-semibold text-text-primary">Personal Information</h3>
                         <p className="text-sm text-text-muted">Basic info about your recruiter account.</p>
                     </div>
                 </div>
             </div>
             
             <div className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                        <p className="text-base text-text-primary font-medium flex items-center gap-2">
                             <User className="w-4 h-4 text-primary" /> {user?.name || 'Recruiter User'}
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                        <p className="text-base text-text-primary font-medium flex items-center gap-2">
                             <Mail className="w-4 h-4 text-primary" /> {user?.email || 'recruiter@example.com'}
                        </p>
                     </div>

                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-muted mb-1">Company</label>
                        <p className="text-base text-text-primary font-medium flex items-center gap-2">
                             <Briefcase className="w-4 h-4 text-primary" /> {user?.companyName || 'Not specified'}
                        </p>
                     </div>
                 </div>
             </div>
          </Card>
      </motion.div>
    </div>
  );
};

export default RecruiterProfile;

