import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSelector from '../../components/common/RoleSelector';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
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
        
        login(user, token, role); 
        
        if (role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
    } catch (error) {
        console.error("Registration failed:", error);
        alert(error.response?.data?.message || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] flex-col justify-center px-6 py-12 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Card className="px-6 py-12 sm:px-10">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                Create an account
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                    Get started with ResumeAI today
                </p>
            </div>

            <RoleSelector selectedRole={role} onSelect={setRole} />
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
                label="Full Name"
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
            />

            {role === 'recruiter' && (
                <Input
                   label="Company Name"
                   id="companyName"
                   type="text"
                   required
                   value={companyName}
                   onChange={(e) => setCompanyName(e.target.value)}
                   placeholder="Acme Inc."
                />
            )}

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

            <div>
                <Input
                    label="Password"
                    id="password"
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
                    placeholder="••••••••"
                />
                 {passwordStrength && (
                    <p className={`text-xs mt-1.5 ml-1 ${
                        passwordStrength === 'Weak' ? 'text-red-500' :
                        passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                       Strength: {passwordStrength}
                    </p>
                 )}
            </div>

            <div>
                <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : null}
                    placeholder="••••••••"
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={!name || !email || !password || password !== confirmPassword || (role === 'recruiter' && !companyName)}
            >
                Sign up as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </Button>
            </form>

            <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link 
                to={`/login?role=${role}`}
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
                Log in
            </Link>
            </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;

