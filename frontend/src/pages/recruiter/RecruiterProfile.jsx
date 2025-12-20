import React from 'react';
import { useAuthStore } from '../../store/authStore';

const RecruiterProfile = () => {
    const { user, updateUser } = useAuthStore();
    
    React.useEffect(() => {
        if (user?._id) {
            import('../../api/apiClient').then(({ getRecruiterProfile }) => { // Lazy import to avoid circular dep if any, though unlikely here
                getRecruiterProfile(user._id)
                    .then(res => updateUser(res.data))
                    .catch(err => console.error(err));
            });
        }
    }, [user?._id, updateUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Recruiter Profile</h1>
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
         <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-500">Basic info about your recruiter account.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
                <p className="text-gray-900"><strong>Name:</strong> {user?.name || 'Recruiter User'}</p>
                <p className="text-gray-900 mt-2"><strong>Email:</strong> {user?.email || 'recruiter@example.com'}</p>
                <p className="text-gray-900 mt-2"><strong>Company:</strong> {user?.companyName || 'Not specified'}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
