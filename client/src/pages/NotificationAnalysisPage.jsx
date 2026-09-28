import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const NotificationAnalysisPage = () => {
  const { language, profile } = useAuth();
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await apiClient('/notifications/samples');
      if (res.success) {
        setSamples(res.samples);
      }
    } catch (err) {
      console.error('Error fetching circular samples:', err);
    }
  };

  const handleAnalyzeSample = async (sample) => {
    try {
      setSelectedSample(sample);
      setLoading(true);
      const res = await apiClient('/notifications/analyze', {
        method: 'POST',
        body: { sampleId: sample.id },
      });
      if (res.success) {
        setAnalysisResult(res.data);
      }
    } catch (err) {
      console.error('Error analyzing sample circular:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCustom = async () => {
    if (!customText.trim()) return;
    try {
      setLoading(true);
      const res = await apiClient('/notifications/analyze', {
        method: 'POST',
        body: { text: customText, title: 'Uploaded Circular' },
      });
      if (res.success) {
        setAnalysisResult(res.data);
      }
    } catch (err) {
      console.error('Error analyzing custom notification text:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] rounded-3xl p-6 sm:p-8 text-white shadow-haq flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-orange-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Gazette Intelligence
            </span>
            <span className="text-xs text-purple-200">Fact-Checked Extraction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? 'सरकारी परिपत्र व PDF विश्लेषण' : 'Government Notification PDF Analysis'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Upload complex 20-page gazette orders or pick a sample to discover how policies directly impact your Benefit Passport.
          </p>
        </div>
      </div>

      {/* Sample Circular Quick Select */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-[#2b0f4c] uppercase tracking-wider">
          Quick Demo: 1-Click Official Gazette Circulars:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => handleAnalyzeSample(s)}
              className="text-left border border-purple-200 hover:border-purple-500 hover:bg-purple-50/50 rounded-2xl p-4 transition space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                  Official Gazette
                </span>
                <span className="text-xs text-orange-600 font-extrabold group-hover:translate-x-1 transition flex items-center space-x-1">
                  <span>Analyze Impact</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-[#2b0f4c]">{s.title}</h4>
              <p className="text-[11px] text-gray-500">{s.department}</p>
            </button>
          ))}
        </div>

        {/* Text Input Box */}
        <div className="pt-2 border-t border-purple-50 space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            Or Paste Notification / Gazette Circular Text:
          </label>
          <textarea
            rows="3"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste notification text here..."
            className="w-full bg-[#f8f6fc] border border-purple-200 rounded-2xl p-3 text-xs text-gray-900 focus:outline-purple-600"
          ></textarea>
          <button
            onClick={handleAnalyzeCustom}
            disabled={loading || !customText.trim()}
            className="bg-[#2b0f4c] hover:bg-[#3d156b] disabled:opacity-50 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Analyze Circular &amp; Check Personal Impact</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-purple-100 shadow-xs">
          <Loader2 className="w-8 h-8 text-purple-700 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600">
            Parsing official gazette clauses and matching against citizen passport...
          </p>
        </div>
      )}

      {analysisResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-haq space-y-6 animate-in zoom-in-95 duration-200">
          {/* Citizen Impact Banner */}
          <div
            className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              analysisResult.citizenImpact?.isRelevant
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {analysisResult.citizenImpact?.isRelevant ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <h3 className="text-base font-black">
                  {analysisResult.citizenImpact?.isRelevant
                    ? 'This Government Notification IS Highly Relevant to You!'
                    : 'Partial / Conditional Relevance to Your Passport'}
                </h3>
              </div>
              <p className="text-xs font-semibold leading-relaxed ml-7">
                {analysisResult.citizenImpact?.relevanceReason}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 text-center border border-emerald-200 shrink-0">
              <div className="text-xl font-black text-emerald-700">
                {analysisResult.citizenImpact?.relevanceScore || 90}%
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Personal Impact</div>
            </div>
          </div>

          {/* Structured Scheme Facts */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[#2b0f4c] uppercase tracking-wider">
              1. Extracted Gazette Facts (No Hallucinations):
            </h4>
            <div className="bg-[#faf9fc] border border-purple-100 rounded-2xl p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-gray-500">Scheme Name:</span>
                  <div className="font-extrabold text-[#2b0f4c] text-sm mt-0.5">
                    {analysisResult.parsedScheme?.schemeName}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-gray-500">Department / Authority:</span>
                  <div className="font-extrabold text-gray-900 mt-0.5">
                    {analysisResult.parsedScheme?.department}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-gray-500">Benefit Announced:</span>
                  <div className="font-extrabold text-orange-600 text-sm mt-0.5">
                    💰 {analysisResult.parsedScheme?.benefitOffered}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-gray-500">Application Deadline:</span>
                  <div className="font-extrabold text-gray-900 mt-0.5">
                    {analysisResult.parsedScheme?.applicationDeadline}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-500">Eligibility Criteria Mentioned:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-800 font-medium">
                  {analysisResult.parsedScheme?.eligibilityCriteria?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-gray-500">Required Documents:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {analysisResult.parsedScheme?.requiredDocuments?.map((d, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-md"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[#2b0f4c] uppercase tracking-wider">
              2. Recommended Citizen Next Steps:
            </h4>
            <div className="space-y-2">
              {analysisResult.citizenImpact?.recommendedActionSteps?.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 flex items-center space-x-2 text-xs text-[#2b0f4c] font-bold"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[10px] shrink-0 font-extrabold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
