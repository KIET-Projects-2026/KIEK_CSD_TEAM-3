import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Bot, LineChart, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      {/* Hero Section */}
      <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
        >
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white/50 backdrop-blur-sm">
              Announcing our next round of updates. <a href="#" className="font-semibold text-primary">Read more <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            AI-Powered Resume Screening
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-primary/80 font-medium">
            Revolutionize your hiring process with advanced machine learning. 
            Match top talent to your job descriptions instantly and bias-free.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/auth/role">
                <Button size="lg" className="group">
                    Get Started 
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </Button>
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-text-primary hover:text-primary transition-colors">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to screen candidates
          </p>
          <p className="mt-6 text-lg leading-8 text-text-muted">
            Our platform handles the repetitive tasks so you can focus on interviewing the best candidates.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
             {/* Feature 1 */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col"
             >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <Bot className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                        AI Matching Engine
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                        <p className="flex-auto">
                            Our proprietary algorithm analyzes resumes against job descriptions to provide a relevance score instantly.
                        </p>
                    </dd>
                </Card>
             </motion.div>

             {/* Feature 2 */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col"
             >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <LineChart className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                        Data-Driven Insights
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                        <p className="flex-auto">
                            Get detailed analytics on your hiring funnel and candidate quality trends over time.
                        </p>
                    </dd>
                </Card>
             </motion.div>

             {/* Feature 3 */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col"
             >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-primary">
                        Bias Elimination
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                        <p className="flex-auto">
                            Focus on skills and experience. Our AI strips away unconscious bias features to ensure fair hiring.
                        </p>
                    </dd>
                </Card>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
