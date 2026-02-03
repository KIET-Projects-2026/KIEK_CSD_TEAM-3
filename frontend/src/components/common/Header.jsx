import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LayoutDashboard, Briefcase, User, LogOut } from 'lucide-react'; // Icons
import Button from '../ui/Button';

const Header = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ResumeAI</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          {isAuthenticated && (
             role === 'recruiter' ? (
               <>
                 <Link to="/recruiter/dashboard" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
                 <Link to="/recruiter/jobs" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><Briefcase className="w-4 h-4"/> Jobs</Link>
                 <Link to="/recruiter/profile" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><User className="w-4 h-4"/> Profile</Link>
               </>
             ) : (
               <>
                 <Link to="/candidate/dashboard" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
                 <Link to="/candidate/job-matches" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><Briefcase className="w-4 h-4"/> Matches</Link>
                 <Link to="/candidate/profile" className="text-sm font-semibold leading-6 text-text-muted hover:text-primary transition-colors flex items-center gap-1"><User className="w-4 h-4"/> Profile</Link>
               </>
             )
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          ) : (
            <Link to="/login">
                <Button size="sm">Log in <span aria-hidden="true" className="ml-1">&rarr;</span></Button>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile Menu (Simple implementation) */}
      {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
               {isAuthenticated ? (
                  <>
                    <button onClick={handleLogout} className="text-left font-semibold text-text-primary">Logout</button>
                    {/* Add other mobile links here if needed */}
                  </>
               ) : (
                   <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-primary">Log in</Link>
               )}
          </div>
      )}
    </header>
  );
};

export default Header;



/*text-indigo-600 hover:text-indigo-500 font-medium*/