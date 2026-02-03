import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleAuthChoice = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Join ResumeAI
        </h2>
        <p className="mt-2 text-lg text-text-muted">
          Choose your account type to get started
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Option */}
            <Link to="/register?role=candidate" className="group">
                <Card className="h-full p-8 hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">I'm a Candidate</h3>
                    <p className="text-text-muted">
                        Find jobs that match your skills instantly using AI-powered matching.
                    </p>
                </Card>
            </Link>

            {/* Recruiter Option */}
            <Link to="/register?role=recruiter" className="group">
                <Card className="h-full p-8 hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                        <Briefcase className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">I'm a Recruiter</h3>
                    <p className="text-text-muted">
                        Post jobs and find the perfect candidates with automated screening.
                    </p>
                </Card>
            </Link>
        </div>

        <div className="mt-12 text-center">
            <p className="text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                    Log in
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleAuthChoice;


