import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import RoleSelector from '../../components/common/RoleSelector';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // Update role if query param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'recruiter' || roleParam === 'candidate') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const payload = {
            name,
            email,
            password,
            role,
            companyName: role === 'recruiter' ? companyName : undefined
        };
        
        // Call Backend
        const { data } = await import('../../api/apiClient').then(m => m.registerUser(payload));
        
        // Use real token from backend
        const token = data.token;
        const user = { ...data };
        delete user.token;
        
        login(user, token, role); // Using login action (or register action if preferred)
        
        if (role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
    } catch (error) {
        console.error("Registration failed:", error);
        alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RoleSelector selectedRole={role} onSelect={setRole} />
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {role === 'recruiter' && (
             <div>
               <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">
                 Company Name
               </label>
               <div className="mt-2">
                 <input
                   id="companyName"
                   name="companyName"
                   type="text"
                   required
                   value={companyName}
                   onChange={(e) => setCompanyName(e.target.value)}
                   className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 />
               </div>
             </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                    const newPass = e.target.value;
                    setPassword(newPass);
                    // Simple strength meter
                    if (newPass.length === 0) setPasswordStrength('');
                    else if (newPass.length < 6) setPasswordStrength('Weak');
                    else if (newPass.length < 10 || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) setPasswordStrength('Medium');
                    else setPasswordStrength('Strong');
                }}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {passwordStrength && (
                 <p className={`text-xs mt-1 ${
                     passwordStrength === 'Weak' ? 'text-red-500' :
                     passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                 }`}>
                    Strength: {passwordStrength}
                 </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
               {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
               )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!name || !email || !password || password !== confirmPassword || (role === 'recruiter' && !companyName)}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Sign up as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => navigate(`/login?role=${role}`)} 
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
