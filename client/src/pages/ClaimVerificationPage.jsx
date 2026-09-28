import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ClaimVerificationPage = () => {
  const { language } = useAuth();
  const [claimText, setClaimText] = useState('');
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await apiClient('/claims/trending');
      if (res.success) {
        setTrending(res.trendingRumors);
      }
    } catch (err) {
      console.error('Error fetching trending claims:', err);
    }
  };

  const handleVerify = async (textToVerify = claimText) => {
    if (!textToVerify.trim()) return;
    try {
      setLoading(true);
      const res = await apiClient('/claims/verify', {
        method: 'POST',
        body: { claimText: textToVerify },
      });
      if (res.success) {
        setResult(res.result);
      }
    } catch (err) {
      console.error('Error verifying claim:', err);
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
            <span className="text-[10px] bg-red-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Benefit Firewall
            </span>
            <span className="text-xs text-purple-200">Anti-Phishing &amp; Fact Check</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? 'कल्याणकारी दावा सत्यापन (Benefit Firewall)' : 'Welfare Claim Verification'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Protect citizens from WhatsApp scams, fake registration links, and misleading welfare promises by verifying against sovereign government gazettes.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
        <label className="block text-sm font-extrabold text-[#2b0f4c]">
          व्हाट्सएप या सोशल मीडिया संदेश यहाँ पेस्ट करें (Paste Viral Claim / Message):
        </label>
        <textarea
          rows="3"
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          placeholder="जैसे: 'सरकार दे रही है सभी को फ्री स्मार्टफोन और लैपटॉप, अभी इस लिंक पर क्लिक करें'..."
          className="w-full bg-[#f8f6fc] border border-purple-200 rounded-2xl p-3.5 text-xs sm:text-sm text-gray-900 focus:outline-purple-600"
        ></textarea>

        <button
          onClick={() => handleVerify()}
          disabled={loading || !claimText.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl transition flex items-center space-x-2 shadow-md shadow-orange-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Verifying with Sovereign Sources...' : 'Verify Welfare Claim (जांचें)'}</span>
        </button>

        {/* 1-Click Trending Rumors */}
        <div className="pt-4 border-t border-purple-50 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            1-Click Trending Viral Claims for Hackathon Evaluation:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {trending.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setClaimText(t.claimText);
                  handleVerify(t.claimText);
                }}
                className="text-left border border-purple-100 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-100/50 rounded-xl p-3 text-xs font-bold text-[#2b0f4c] transition leading-snug group"
              >
                <span>⚠️ {t.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center space-y-2 border border-purple-100 shadow-xs">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600">
            Scanning official PIB records and verified database...
          </p>
        </div>
      )}

      {/* Verification Result Display */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-haq space-y-6 animate-in zoom-in-95 duration-200">
          {/* Verdict Banner */}
          <div
            className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              result.verdict === 'VERIFIED'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : result.verdict === 'POTENTIALLY MISLEADING'
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start space-x-3">
              {result.verdict === 'VERIFIED' ? (
                <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
              ) : result.verdict === 'POTENTIALLY MISLEADING' ? (
                <ShieldAlert className="w-7 h-7 text-red-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
              )}
              <div>
                <div className="text-xs font-black uppercase tracking-wider">
                  VERDICT: {result.verdict}
                </div>
                <h3 className="text-base font-black mt-0.5">
                  {language === 'hi' && result.analysis?.headlineHi
                    ? result.analysis.headlineHi
                    : result.analysis?.headline}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shrink-0">
              <div className="text-xl font-black text-purple-900">
                {result.confidenceScore}%
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Confidence</div>
            </div>
          </div>

          {/* Truth Summary */}
          <div className="bg-[#faf9fc] rounded-2xl p-5 border border-purple-100 space-y-3 text-xs">
            <div>
              <span className="font-extrabold text-[#2b0f4c] uppercase tracking-wider block mb-1">
                Official Truth Summary (वास्तविक तथ्य):
              </span>
              <p className="text-gray-800 leading-relaxed font-medium">
                {language === 'hi' && result.analysis?.truthSummaryHi
                  ? result.analysis.truthSummaryHi
                  : result.analysis?.truthSummary}
              </p>
            </div>

            {/* False claims if any */}
            {result.analysis?.falseClaims?.length > 0 && (
              <div>
                <span className="font-extrabold text-red-700 block mb-1">
                  ❌ भ्रामक या झूठे दावे (Misleading Claims Identified):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-red-900 font-medium">
                  {result.analysis.falseClaims.map((fc, i) => (
                    <li key={i}>{fc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verified Facts */}
            {result.analysis?.verifiedFacts?.length > 0 && (
              <div>
                <span className="font-extrabold text-emerald-800 block mb-1">
                  ✓ सत्यापित सरकारी नियम (Statutory Facts):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-950 font-medium">
                  {result.analysis.verifiedFacts.map((vf, i) => (
                    <li key={i}>{vf}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Advisory */}
            {result.analysis?.advisory && (
              <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3 text-amber-950 font-bold">
                ⚠️ Advisory: {result.analysis.advisory}
              </div>
            )}
          </div>

          {/* Official Source Link */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-50">
            <span className="text-gray-500 font-bold">Official Verification Source:</span>
            <a
              href={result.analysis?.officialFactCheckUrl || 'https://factcheck.pib.gov.in'}
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 hover:text-purple-950 font-extrabold flex items-center space-x-1"
            >
              <span>{result.analysis?.officialFactCheckUrl || 'factcheck.pib.gov.in'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
