import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import RoleSelector from '../../components/common/RoleSelector';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        // Pass role to backend for strict validation
        const { data } = await import('../../api/apiClient').then(m => m.loginUser({ email, password, role }));
        
        // Use real token from backend
        // data contains: { _id, name, email, role, token, ... }
        const token = data.token;
        
        // Remove token from user object before storing (optional, but cleaner)
        const user = { ...data };
        delete user.token;

        if (role !== user.role) {
             // This should ideally be caught by backend now, but double check doesn't hurt
             alert(`Warning: You logged in as ${user.role} but tried to access ${role} page.`);
        }
        
        login(user, token, user.role);
        
        if (user.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
    } catch (error) {
        console.error("Login failed:", error);
        // Show specific backend error message if available
        alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RoleSelector selectedRole={role} onSelect={setRole} />
        
        <div className="text-center mb-4">
             <p className="text-sm text-gray-600">Logging in as: <span className="font-semibold text-indigo-600 capitalize">{role}</span></p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate(`/register?role=${role}`)} 
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
