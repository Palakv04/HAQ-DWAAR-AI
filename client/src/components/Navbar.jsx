import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Globe,
  Compass,
  Mic,
  FolderSync,
  Building2,
  FileCheck2,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Navbar = ({ onOpenCscModal, onOpenDigiLockerModal }) => {
  const { user, profile, language, changeLanguage } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/',              labelEn: 'Dashboard',     labelHi: 'डैशबोर्ड',      icon: Compass    },
    { to: '/schemes',       labelEn: 'Schemes',       labelHi: 'योजनाएं',        icon: Sparkles   },
    { to: '/ai-mitra',      labelEn: 'AI Mitra',      labelHi: 'जन सहायक',       icon: Mic        },
    { to: '/documents',     labelEn: 'Documents',     labelHi: 'दस्तावेज़',       icon: FolderSync },
    { to: '/applications',  labelEn: 'Applications',  labelHi: 'आवेदन',          icon: FileCheck2 },
  ];

  const moreLinks = [
    { to: '/notification-analysis', labelEn: 'Govt PDF Analysis', labelHi: 'सरकारी परिपत्र', icon: FileCheck2    },
    { to: '/verify-claim',          labelEn: 'Benefit Firewall',  labelHi: 'दावा सत्यापन',   icon: AlertTriangle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e9e1f5] shadow-sm">

      {/* ── Top micro-banner ── */}
      <div className="bg-[#2b0f4c] text-white px-3 sm:px-6 py-1 text-[11px] font-medium flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-purple-200 truncate">
            {language === 'hi'
              ? 'राष्ट्रीय नागरिक कल्याण व अधिकारिता गेटवे • भारत सरकार'
              : 'National Citizen Welfare Gateway • Govt of India'}
          </span>
        </div>
        <div className="hidden sm:flex shrink-0 items-center gap-3 text-purple-200 whitespace-nowrap">
          <button
            onClick={() => onOpenDigiLockerModal?.()}
            className="flex items-center gap-1 hover:text-emerald-400 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            DigiLocker API v3.2
          </button>
          <span>|</span>
          <button onClick={() => onOpenCscModal?.()} className="hover:text-orange-300 transition">
            CSC: 1800-180-1515
          </button>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] flex items-center justify-center shadow-md shadow-purple-900/20">
              <span className="font-bold text-lg sm:text-xl tracking-wider text-orange-400">H</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-[#2b0f4c] tracking-tight">HaqDwaar</span>
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">AI</span>
              </div>
              <div className="hidden sm:block text-[10px] font-semibold text-purple-700 leading-none mt-0.5">
                Scheme se Application Tak
              </div>
            </div>
          </Link>

          {/* Desktop Nav — shown from lg */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ to, labelEn, labelHi, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(to)
                    ? 'bg-[#2b0f4c] text-white shadow-sm'
                    : 'text-[#4a4458] hover:text-[#2b0f4c] hover:bg-purple-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive(to) ? 'text-orange-400' : 'text-purple-600'}`} />
                <span>{language === 'hi' ? labelHi : labelEn}</span>
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-[#4a4458] hover:text-[#2b0f4c] hover:bg-purple-50 transition">
                <span>{language === 'hi' ? 'अन्य' : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-purple-100 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                {moreLinks.map(({ to, labelEn, labelHi, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-600" />
                    {language === 'hi' ? labelHi : labelEn}
                  </Link>
                ))}
                <div className="border-t border-purple-100 my-1" />
                <button
                  onClick={() => onOpenCscModal?.()}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    {language === 'hi' ? 'CSC सहायता केंद्र' : 'CSC Centers'}
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Nearby</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* DigiLocker badge — md+ only */}
            <button
              onClick={() => onOpenDigiLockerModal?.()}
              className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-emerald-100 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">DigiLocker</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </button>

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-lg border border-purple-200 transition"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-purple-700" />
                <span className="hidden sm:inline">{language === 'hi' ? 'HI' : 'EN'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-purple-200 py-1.5 z-50">
                  {[
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
                    { code: 'en', label: 'English' },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => { changeLanguage(code); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition ${
                        language === code ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-purple-50 text-gray-700'
                      }`}
                    >
                      {label}
                      {language === code && <span>✓</span>}
                    </button>
                  ))}
                  <div className="border-t border-purple-100 my-1" />
                  <p className="px-3 py-1 text-[10px] text-gray-500">Bhojpuri, Maithili in Voice AI</p>
                </div>
              )}
            </div>

            {/* Profile chip */}
            <Link
              to="/passport"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100/70 border border-purple-200 hover:border-purple-400 p-1 sm:px-2.5 sm:py-1.5 rounded-xl transition"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2b0f4c] text-white flex items-center justify-center font-bold text-xs">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-[#2b0f4c]">{profile?.name || 'Citizen'}</div>
                <div className="text-[10px] text-gray-500">{user?.ruralId || '#0001'}</div>
              </div>
            </Link>

            {/* Hamburger — lg se chhota */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-purple-900 hover:bg-purple-50 rounded-lg transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-purple-200 px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top duration-200">
          {/* User info row */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2b0f4c] text-white flex items-center justify-center font-bold text-xs">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xs font-bold text-[#2b0f4c]">{profile?.name || 'Citizen'}</div>
                <div className="text-[10px] text-gray-500">{user?.ruralId || '#0001'} • {profile?.district || ''}</div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Verified</span>
          </div>

          {/* Nav grid */}
          <div className="grid grid-cols-2 gap-2">
            {[...navLinks, ...moreLinks].map(({ to, labelEn, labelHi, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition ${
                  isActive(to)
                    ? 'bg-[#2b0f4c] text-white border-[#2b0f4c]'
                    : 'bg-purple-50/60 hover:bg-purple-100 text-[#2b0f4c] border-purple-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive(to) ? 'text-orange-400' : 'text-purple-700'}`} />
                <span className="truncate">{language === 'hi' ? labelHi : labelEn}</span>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDigiLockerModal?.(); }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Sync DigiLocker
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCscModal?.(); }}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
            >
              <Building2 className="w-4 h-4" />
              {language === 'hi' ? 'CSC केंद्र' : 'CSC Kendra'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
