import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

// Route-aware header for public pages
const PublicHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ResumeAI</span>
          </Link>
          
          <div className="flex flex-1 justify-end gap-3">
              {/* Landing Page: Login + Get Started */}
              {path === '/' && (
                  <>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link to="/auth/role">
                        <Button size="sm">Get Started</Button>
                    </Link>
                  </>
              )}

              {/* Login Page: Show 'Create account' */}
              {path === '/login' && (
                  <Link to="/auth/role">
                      <Button size="sm">Create account</Button>
                  </Link>
              )}

              {/* Signup Pages: Show 'Log in' */}
              {(path === '/register' || path === '/auth/role') && (
                  <Link to="/login">
                      <Button variant="ghost" size="sm">Log in &rarr;</Button>
                  </Link>
              )}
          </div>
        </nav>
    </header>
  );
};

const PublicLayout = () => {
  return (
    <div className="min-h-screen pt-16">
      <PublicHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

