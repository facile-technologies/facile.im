import React from 'react';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex w-full bg-background-light dark:bg-zinc-950">
      {/* Left Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 xl:px-40 py-12 transition-all duration-300">
        <div className="w-full max-w-[480px] mx-auto lg:mx-0">
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <span className="text-xl font-bold text-primary dark:text-white">Facile Admin</span>
            </div>

            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>

      {/* Right Side - Brand Banner (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-primary-dark/20 backdrop-blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark/40 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 text-white max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-2xl">
              <ShoppingBag size={40} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Manage Your Business with <span className="text-purple-200">Confidence</span></h2>
          <p className="text-lg text-purple-100/80 leading-relaxed">
            Streamline your operations, track performance, and grow your business with our powerful admin suite.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
