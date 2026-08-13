import React from 'react';
import { Rocket, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon Area */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
        <div className="relative w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl flex items-center justify-center border border-gray-100 dark:border-zinc-800 rotate-3">
          <Rocket className="w-12 h-12 text-primary animate-bounce-slow" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-zinc-900 dark:bg-white rounded-2xl shadow-lg flex items-center justify-center -rotate-12">
          <Clock className="w-5 h-5 text-white dark:text-zinc-900" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
        Coming <span className="text-primary">Soon</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        We're working hard to bring you this feature. Stay tuned for something amazing!
      </p>

      {/* Decorative Progress */}
      <div className="w-full max-w-xs h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-10">
        <div className="w-2/3 h-full bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Go Back
      </button>

      {/* Decorative Dots */}
      <div className="mt-20 flex gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
};

export default ComingSoon;
