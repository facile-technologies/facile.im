import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { Mail, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);



  // ...

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Recovery instructions sent to your email.');
    }, 2000);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive recovery instructions."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              Send Instructions <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
