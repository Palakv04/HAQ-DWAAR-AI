import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ApplicationsPage = () => {
  const { language } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await apiClient('/applications');
      if (res.success) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStep = async (appId, currentStep) => {
    const nextStep = Math.min(currentStep + 1, 5);
    const statusMap = {
      1: 'Draft',
      2: 'Documents Pending',
      3: 'Under Review',
      4: 'Applied',
      5: 'Sanctioned',
    };

    try {
      const res = await apiClient(`/applications/${appId}`, {
        method: 'PATCH',
        body: {
          currentStep: nextStep,
          status: statusMap[nextStep],
        },
      });
      if (res.success) {
        await fetchApplications();
      }
    } catch (err) {
      console.error('Error advancing application step:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] rounded-3xl p-6 sm:p-8 text-white shadow-haq flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-orange-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Application Tracker
            </span>
            <span className="text-xs text-purple-200">Real-Time State Welfare Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? 'मेरे आवेदन (My Applications)' : 'My Applications'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Track statutory progression from citizen profile verification to final Direct Benefit Transfer (DBT) credit.
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20 shrink-0">
          <div className="text-2xl font-black text-orange-400">{applications.length}</div>
          <div className="text-[10px] text-purple-200 font-bold uppercase">Active Applications</div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs font-bold text-gray-500">
          Fetching application timelines from welfare registry...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-purple-100 shadow-xs">
          <FileCheck2 className="w-12 h-12 text-purple-300 mx-auto" />
          <h3 className="text-base font-extrabold text-[#2b0f4c]">No Saved Applications Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore recommended schemes on the dashboard and click "Save to My Applications" in the action plan.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-haq space-y-5"
            >
              {/* Application Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold bg-purple-100 text-purple-900 px-2 py-0.5 rounded uppercase">
                      Tracking No: {app.trackingNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#2b0f4c] mt-1">
                    {app.schemeName}
                  </h3>
                  {app.benefitAmount > 0 && (
                    <div className="text-xs font-bold text-orange-600 mt-0.5">
                      Grant Benefit: ₹{app.benefitAmount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      app.status === 'Sanctioned' || app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Applied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* 5-Step Progress Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Progression Timeline (चरणबद्ध स्थिति):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {app.steps.map((st, idx) => {
                    const isDone = st.status === 'completed';
                    const isInProg = st.status === 'in_progress';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : isInProg
                            ? 'bg-orange-50 border-orange-300 text-orange-950 ring-1 ring-orange-200'
                            : 'bg-gray-50 border-gray-100 text-gray-400'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1.5 bg-white shadow-2xs">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            st.stepNumber
                          )}
                        </div>
                        <div className="text-[11px] font-extrabold leading-tight">
                          {language === 'hi' && st.titleHi ? st.titleHi : st.title}
                        </div>
                        <div className="text-[9px] font-bold mt-1 uppercase tracking-wider opacity-80">
                          {st.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checklist & Demo State Changer */}
              <div className="bg-[#faf9fc] rounded-2xl p-4 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-gray-700">
                  <span className="font-bold text-[#2b0f4c]">Demo Status Control:</span> Advance application progress through lifecycle verification.
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleAdvanceStep(app._id, app.currentStep)}
                    disabled={app.currentStep >= 5}
                    className="bg-[#2b0f4c] hover:bg-[#3d156b] disabled:opacity-50 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Advance Next Stage ➔</span>
                  </button>

                  {app.officialPortalUrl && (
                    <a
                      href={app.officialPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white hover:bg-purple-50 text-[#2b0f4c] border border-purple-200 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-purple-700" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
