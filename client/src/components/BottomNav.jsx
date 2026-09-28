import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Landmark, Mic, FolderSync, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNav = ({ onOpenVoiceModal }) => {
  const location = useLocation();
  const { t } = useAuth();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e5dcf2] shadow-[0_-4px_20px_rgba(43,15,76,0.08)] px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            isCurrent('/') ? 'text-[#2b0f4c] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isCurrent('/') ? 'text-[#2b0f4c] stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium leading-none">
            {t('home')}
          </span>
        </Link>

        {/* 2. Schemes */}
        <Link
          to="/schemes"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            isCurrent('/schemes') ? 'text-[#2b0f4c] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Landmark className={`w-5 h-5 ${isCurrent('/schemes') ? 'text-[#2b0f4c] stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium leading-none">
            {t('schemes')}
          </span>
        </Link>

        {/* 3. Voice AI Center Elevated Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={() => onOpenVoiceModal?.()}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-white animate-pulse-mic transform active:scale-95 transition"
            aria-label="Open Voice AI Mitra"
          >
            <Mic className="w-7 h-7" />
          </button>
          <span className="text-[10px] font-extrabold text-[#ea580c] mt-0.5 leading-none">
            {t('voiceAi')}
          </span>
        </div>

        {/* 4. Documents */}
        <Link
          to="/documents"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            isCurrent('/documents') ? 'text-[#2b0f4c] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FolderSync className={`w-5 h-5 ${isCurrent('/documents') ? 'text-[#2b0f4c] stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium leading-none">
            {t('documents')}
          </span>
        </Link>

        {/* 5. Profile */}
        <Link
          to="/passport"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            isCurrent('/passport') ? 'text-[#2b0f4c] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className={`w-5 h-5 ${isCurrent('/passport') ? 'text-[#2b0f4c] stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium leading-none">
            {t('profile')}
          </span>
        </Link>
      </div>
    </nav>
  );
};
