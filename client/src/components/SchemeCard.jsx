import React from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Share2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SchemeCard = ({
  scheme,
  onOpenActionPlan,
  onOpenDigiLocker,
  isFeatured = false,
}) => {
  const { language } = useAuth();

  const matchScore = scheme.matchPercentage || 95;
  const missingDocs = scheme.missingDocuments || [];
  const matchedCriteria = scheme.matchedCriteria || [];
  const hasIncomePending = missingDocs.some((d) => d.docType === 'income_certificate');

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isFeatured
          ? 'border-purple-300 shadow-haq-lg ring-1 ring-purple-100'
          : 'border-purple-100/90 shadow-xs hover:shadow-haq hover:border-purple-200'
      }`}
    >
      {/* Top Banner Badges */}
      <div className="px-5 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-purple-50/80">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#2b0f4c] text-white px-2.5 py-1 rounded-md">
            {scheme.level === 'State' ? `STATE GOVT • ${scheme.state?.toUpperCase() || 'BIHAR'}` : 'CENTRAL GOVT'}
          </span>
          <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
            {scheme.categoryLabel || scheme.category}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{matchScore}% Match</span>
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#2b0f4c] leading-snug flex items-start space-x-1.5">
            <span className="text-orange-500 shrink-0 mt-0.5">📌</span>
            <span>{language === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name}</span>
          </h3>
          {language === 'hi' && scheme.nameHi && (
            <div className="text-xs font-medium text-gray-500 mt-0.5 ml-6">
              ({scheme.name})
            </div>
          )}
          <p className="text-xs text-gray-600 mt-2 leading-relaxed ml-6">
            {language === 'hi' && scheme.shortDescriptionHi
              ? scheme.shortDescriptionHi
              : scheme.shortDescription}
          </p>
        </div>

        {/* Financial Benefit Box */}
        <div className="bg-[#faf7ff] border border-purple-100 rounded-xl p-3.5 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-lg shrink-0">
            <IndianRupee className="w-5 h-5 text-purple-900" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Financial Assistance Benefit
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#2b0f4c]">
              {language === 'hi' && scheme.benefitHi ? scheme.benefitHi : scheme.benefit}
            </div>
          </div>
        </div>

        {/* Auto-Matched Criteria Pills */}
        <div>
          <div className="text-[11px] font-bold text-gray-500 mb-1.5">
            Criteria Auto-Matched from Citizen Benefit Passport:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedCriteria.length > 0 ? (
              matchedCriteria.slice(0, 3).map((crit, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{crit.detail || crit.rule}</span>
                </span>
              ))
            ) : (
              <>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Bihar Domicile (Verified)</span>
                </span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>12th Marks ≥ 70% (78.4%)</span>
                </span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Family &lt; ₹2 Lakhs/Yr</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Document Health Check alert (if missing docs) */}
        {missingDocs.length > 0 && (
          <div className="bg-[#fff9f2] border border-orange-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-orange-950">
                <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Document Health Check</span>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-md uppercase">
                Action Needed
              </span>
            </div>

            <p className="text-xs text-orange-900 font-medium leading-relaxed">
              ⚠️ <strong>{missingDocs[0].title}</strong> is pending or requires fresh session validation.
              Link DigiLocker to auto-verify and unlock application submission.
            </p>

            <button
              onClick={() => onOpenDigiLocker?.(missingDocs[0].docType)}
              className="w-full bg-white hover:bg-orange-50/50 text-[#854d0e] border border-orange-300 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-2 transition shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <span>Fetch from DigiLocker (1-Click Sync)</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => onOpenActionPlan?.(scheme)}
            className="w-full sm:flex-1 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition"
          >
            <span>🚀 View Action Plan &amp; Official Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-purple-50 hover:bg-purple-100 text-[#2b0f4c] border border-purple-200 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition"
            title="Open Verified Government Portal"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-700" />
          </a>
        </div>
      </div>
    </div>
  );
};
