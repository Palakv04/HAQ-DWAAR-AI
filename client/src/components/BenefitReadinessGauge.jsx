import React from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BenefitReadinessGauge = ({ onOpenDigiLockerModal, isMobile = false }) => {
  const { readiness, documents, language } = useAuth();

  const score = readiness?.overallReadiness ?? 82;
  const verifiedCount = documents.filter((d) => d.status === 'verified').length;
  const actionPendingCount = documents.filter((d) => d.status === 'action_needed' || d.status === 'expired').length;
  const totalCount = Math.max(documents.length, 6);

  // SVG ring calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (isMobile) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#f1ecf9"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-extrabold text-[#2b0f4c] leading-none">
                  {score}%
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-extrabold text-[#2b0f4c]">Benefit Readiness</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                <span>{score >= 80 ? '🟢 High Match / उच्च पात्रता' : 'Action Needed'}</span>
              </div>
            </div>
          </div>

          {actionPendingCount > 0 ? (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>{actionPendingCount} Missing Docs</span>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded-lg flex items-center space-x-1 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>All Verified</span>
            </div>
          )}
        </div>

        <div className="mt-3 bg-[#faf5ff] border border-purple-100 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#3b0764]">
          <div className="flex items-center space-x-2">
            <span className="text-base">💰</span>
            <span className="font-semibold text-[11px] leading-tight">
              {language === 'hi'
                ? 'आप ₹48,000+ वार्षिक केंद्रीय व राज्य लाभों के पात्र हैं।'
                : 'You are eligible for ₹48,000+ annual central & state benefits.'}
            </span>
          </div>
          {actionPendingCount > 0 && (
            <button
              onClick={() => onOpenDigiLockerModal?.()}
              className="text-[10px] bg-purple-700 text-white font-bold px-2 py-1 rounded-md shrink-0 ml-2"
            >
              Sync
            </button>
          )}
        </div>
      </div>
    );
  }

  // Desktop Card View
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/90 shadow-haq relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-[#2b0f4c]">Benefit Readiness</h3>
            <span className="text-xs text-gray-500 font-medium">पात्रता स्थिति</span>
          </div>
          <span className="text-[11px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
            Aadhaar Linked
          </span>
        </div>

        <div className="flex items-center space-x-5 my-4">
          {/* Radial Ring Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#f3e8ff"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-[#2b0f4c] leading-none">
                {score}%
              </span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Ready</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-extrabold text-[#2b0f4c] flex items-center space-x-1.5">
              <span>Very High Eligibility Match</span>
            </div>
            <p className="text-xs text-gray-600 leading-snug">
              {verifiedCount} verified certificates out of {totalCount} required for complete entitlement unlocking.
            </p>

            <div className="flex items-center space-x-2 pt-1 text-[11px] font-bold">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{verifiedCount} Verified</span>
              </span>
              {actionPendingCount > 0 && (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{actionPendingCount} Action Pending</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notice alert */}
        <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-3 text-xs text-[#2b0f4c] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">
              {actionPendingCount > 0
                ? `${actionPendingCount} Documents required to unlock remaining ₹24,000 grants:`
                : 'All documents verified! Complete ₹48,000 grants unlocked.'}
            </span>
            {actionPendingCount > 0 && (
              <span className="text-gray-700 block mt-0.5">
                आय प्रमाण पत्र (Income Certificate) एवं खतौनी (Land Record) लंबित हैं।
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-50">
        <button
          onClick={() => onOpenDigiLockerModal?.()}
          className="w-full bg-[#2b0f4c] hover:bg-[#3d156b] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Sync DigiLocker to Auto-Unlock (ऑटो-लिंक करें)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
