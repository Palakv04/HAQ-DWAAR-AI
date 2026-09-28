import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Download,
  BookmarkPlus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ActionPlanModal = ({ isOpen, onClose, scheme, onOpenDigiLocker }) => {
  const { profile, language } = useAuth();
  const [loading, setLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && scheme) {
      loadActionPlan();
      setSavedSuccess(false);
    }
  }, [isOpen, scheme]);

  const loadActionPlan = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`/action-plan/${scheme._id}`, { method: 'POST' });
      if (res.success) {
        setActionPlan(res.actionPlan);
        setEvaluation(res.evaluation);
      }
    } catch (err) {
      console.error('Failed to load action plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMyApplications = async () => {
    try {
      const res = await apiClient('/applications', {
        method: 'POST',
        body: {
          schemeId: scheme._id,
          notes: 'Enrolled via HaqDwaar Personalized Action Plan',
        },
      });
      if (res.success) {
        setSavedSuccess(true);
      }
    } catch (err) {
      console.error('Save application error:', err);
    }
  };

  if (!isOpen || !scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-purple-200 overflow-hidden text-gray-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold leading-tight">
                {language === 'hi' ? 'व्यक्तिगत आवेदन कार्ययोजना' : 'Personalized Action Plan'}
              </h3>
              <p className="text-[11px] text-purple-200">
                Scheme se Application Tak • Step-by-Step Guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scheme Hero Header */}
        <div className="bg-purple-50/70 p-5 border-b border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
              {scheme.level} Govt • {scheme.category}
            </span>
            <h4 className="text-base font-extrabold text-[#2b0f4c] mt-1">
              {language === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name}
            </h4>
            <div className="text-xs font-bold text-orange-600 mt-0.5">
              💰 {scheme.benefit}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="text-right">
              <div className="text-sm font-black text-emerald-700">
                {evaluation?.matchPercentage || 95}% Match
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">High Eligibility</div>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 className="w-8 h-8 text-purple-700 animate-spin" />
              <p className="text-xs font-semibold text-gray-600">
                Generating personalized application roadmap...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actionPlan.map((step) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';

                return (
                  <div
                    key={step.stepNumber}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isInProgress
                        ? 'border-orange-300 bg-orange-50/40 ring-1 ring-orange-200'
                        : 'border-purple-100 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isInProgress
                              ? 'bg-orange-500 text-white'
                              : 'bg-purple-100 text-purple-900'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-extrabold text-[#2b0f4c]">
                            {language === 'hi' && step.titleHi ? step.titleHi : step.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-orange-100 text-orange-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>

                    {/* Action button inside step */}
                    <div className="mt-3 pl-10 flex flex-wrap gap-2">
                      {step.actionType === 'fetch_digilocker' && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDigiLocker?.('income_certificate');
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>1-Click DigiLocker Sync</span>
                        </button>
                      )}

                      {step.actionType === 'open_official_portal' && (
                        <a
                          href={scheme.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
                        >
                          <span>Open Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {step.actionType === 'download_summary' && (
                        <button
                          onClick={() => alert(`Pre-filled entitlement summary for ${scheme.name} downloaded.`)}
                          className="bg-purple-100 hover:bg-purple-200 text-[#2b0f4c] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Summary Slip</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Success Banner if saved to applications */}
          {savedSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold p-3 rounded-xl flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'hi'
                  ? 'योजना आपके "मेरे आवेदन" ट्रैकर में सहेज ली गई है!'
                  : 'Scheme added to your "My Applications" tracking dashboard!'}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleSaveToMyApplications}
            disabled={savedSuccess}
            className="w-full sm:w-auto bg-white hover:bg-purple-50 text-[#2b0f4c] border border-purple-200 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-2xs"
          >
            <BookmarkPlus className="w-4 h-4 text-purple-700" />
            <span>{savedSuccess ? 'Saved to Applications ✓' : 'Save to My Applications'}</span>
          </button>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-orange-500/20"
          >
            <span>Proceed to Official Government Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
