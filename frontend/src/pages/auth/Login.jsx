import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSelector from '../../components/common/RoleSelector';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update role if query param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'recruiter' || roleParam === 'candidate') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        const { data } = await import('../../api/apiClient').then(m => m.loginUser({ email, password, role }));
        
        const token = data.token;
        const user = { ...data };
        delete user.token;

        if (role !== user.role) {
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
        alert(error.response?.data?.message || 'Login failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Card className="px-6 py-12 sm:px-10">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                Welcome back
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                    Sign in to your account
                </p>
            </div>

            <RoleSelector selectedRole={role} onSelect={setRole} />
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
                label="Email address"
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
            />

            <Input
                label="Password"
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Sign in as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </Button>
            </form>

            <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link 
                to={`/register?role=${role}`}
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
                Create account
            </Link>
            </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

