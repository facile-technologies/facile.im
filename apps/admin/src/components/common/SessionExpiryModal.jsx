import React from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';
import { logout } from '../../store/features/authSlice';

const SessionExpiryModal = () => {
  const isSessionExpired = useSelector((state) => state.auth.isSessionExpired);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isSessionExpired) return null;

  const handleLoginRedirect = () => {
    dispatch(logout());
    navigate('/login');
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/5 dark:to-orange-500/5 -z-10" />

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6 shadow-inner">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Session Expired
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Your session has been expired. Please login again to continue managing your business with confidence.
          </p>

          <button
            onClick={handleLoginRedirect}
            className="w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark active:scale-[0.98] transition-all shadow-xl shadow-primary/25"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Log In Again
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SessionExpiryModal;
