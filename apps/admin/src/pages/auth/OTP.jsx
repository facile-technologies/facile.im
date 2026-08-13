import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { ShieldCheck, ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OTP = () => {
  const [isLoading, setIsLoading] = useState(false);



  // ...

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Identity verified successfully!');
    }, 2000);
  };

  return (
    <AuthLayout
      title="Verify Identity"
      subtitle="Enter the 6-digit code sent to your email."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Secure Code</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="000 000"
              className="w-full pl-11 pr-4 py-3 text-center text-2xl tracking-[0.5em] font-mono font-bold rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
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
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Code</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn't receive code? <button className="text-primary font-bold hover:underline">Resend</button>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default OTP;
