import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakText, stopSpeaking } from '../utils/speech';

export const AiMitraVoiceModal = ({ isOpen, onClose, initialQuery = '', onOpenActionPlan }) => {
  const { language } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('hi-IN');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recognizer, setRecognizer] = useState(null);

  const samplePrompts = [
    { text: 'मेरी बेटी की कॉलेज फीस में मदद चाहिए?', label: 'बेटी की कॉलेज फीस' },
    { text: 'किसान सम्मान निधि का अगला किस्त कब आएगा?', label: 'किसान 17वीं किश्त' },
    { text: 'मेरे घर की income कम है और B.Tech की fees के लिए scholarship चाहिए', label: 'B.Tech छात्रवृत्ति' },
    { text: 'सिलाई मशीन या विश्वकर्मा टूलकिट का आवेदन कैसे करें?', label: 'विश्वकर्मा टूलकिट' },
  ];

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleExecuteQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!isOpen) {
      if (isListening && recognizer) {
        recognizer.stop();
        setIsListening(false);
      }
      stopSpeaking();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  const toggleListening = () => {
    if (isListening) {
      if (recognizer) recognizer.stop();
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please type your query in the box.');
      return;
    }

    try {
      const rec = createSpeechRecognizer({
        lang: selectedDialect,
        interimResults: true,
      });

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setQuery(transcript);
        if (event.results[0].isFinal) {
          handleExecuteQuery(transcript);
        }
      };

      rec.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognizer(rec);
      rec.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleExecuteQuery = async (queryText = query) => {
    if (!queryText || queryText.trim() === '') return;
    try {
      setLoading(true);
      if (isListening && recognizer) {
        recognizer.stop();
        setIsListening(false);
      }

      const res = await apiClient('/ai-mitra/query', {
        method: 'POST',
        body: {
          query: queryText,
          language: language,
          inputType: isListening ? 'voice' : 'text',
        },
      });

      if (res.success) {
        setResult(res);
        // Optional voice readout
        const textToSpeak = language === 'hi' ? res.responseMessageHi : res.responseMessage;
        speakText(textToSpeak, selectedDialect);
        setIsPlayingAudio(true);
      }
    } catch (err) {
      console.error('AI Mitra query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeak = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (result) {
      const textToSpeak = language === 'hi' ? result.responseMessageHi : result.responseMessage;
      speakText(textToSpeak, selectedDialect);
      setIsPlayingAudio(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#1e0b36] border border-purple-500/30 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-800/60 flex items-center justify-between bg-gradient-to-r from-[#2b0f4c] to-[#1e0b36]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold tracking-tight">AI MITRA • जन सहायक वॉइस</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-purple-300">
                Bilingual &amp; Dialect Aware (Hindi, Bhojpuri, Maithili, English)
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Dialect selector pills */}
          <div className="flex items-center justify-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs text-purple-300 font-semibold mr-1">Dialect:</span>
            {[
              { code: 'hi-IN', label: 'हिन्दी' },
              { code: 'hi-IN', label: 'भोजपुरी (Bhojpuri)' },
              { code: 'hi-IN', label: 'मैथिली (Maithili)' },
              { code: 'en-IN', label: 'English' },
            ].map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDialect(d.code)}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${
                  selectedDialect === d.code && i === 0
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-purple-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Glowing Microphone Section */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <div className="relative">
              <button
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 animate-pulse-mic ring-8 ring-orange-500/30 shadow-orange-500/50'
                    : 'bg-gradient-to-tr from-[#ea580c] to-[#f97316] hover:scale-105 shadow-orange-600/40'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 text-white animate-bounce" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
                <span className="text-xs font-black tracking-wide uppercase mt-1">
                  {isListening ? 'सुन रहे हैं...' : 'बोलें'}
                </span>
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">"बोलकर अपनी समस्या बताएं"</h3>
              <p className="text-xs text-purple-300 mt-0.5">
                {isListening
                  ? 'हम सुन रहे हैं... कृपया स्पष्ट बोलें।'
                  : 'Tap & Speak in Local Dialect. No typing needed.'}
              </p>
            </div>
          </div>

          {/* Text input search fallback */}
          <div className="relative">
            <div className="flex items-center bg-white/10 border border-purple-400/30 rounded-2xl p-1.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition">
              <Search className="w-5 h-5 text-purple-300 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
                placeholder="या यहाँ लिखें: जैसे 'कॉलेज फीस में मदद चाहिए'..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-purple-300/70 focus:outline-none"
              />
              <button
                onClick={() => handleExecuteQuery()}
                disabled={loading || !query.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0"
              >
                <span>{loading ? 'खोज रहे हैं...' : 'खोजें (Ask AI)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick sample prompt chips */}
          {!result && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-300">त्वरित सुझाव (Quick Examples):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(p.text);
                      handleExecuteQuery(p.text);
                    }}
                    className="text-left bg-white/5 hover:bg-white/15 border border-purple-500/20 rounded-xl p-2.5 text-xs text-purple-100 flex items-center justify-between transition group"
                  >
                    <span className="leading-snug">💡 "{p.text}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-orange-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-white/95 text-[#1e1b2e] rounded-2xl p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
              {/* Structured AI Intent Banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-[#2b0f4c]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AI Intent Understanding (Structured Fact Extraction)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                    <span className="bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-md">
                      Category: {result.structuredIntent?.category?.toUpperCase()}
                    </span>
                    <span className="bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-md">
                      Need: {result.structuredIntent?.need}
                    </span>
                    {result.structuredIntent?.incomeConcern && (
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                        Low Income Affirmative
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleToggleSpeak}
                  className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 transition"
                  title="Listen to Explanation (Audio)"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Conversational Explanation */}
              <div className="text-xs text-gray-800 leading-relaxed font-medium bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl">
                🗣️ {language === 'hi' ? result.responseMessageHi : result.responseMessage}
              </div>

              {/* Matched Schemes List */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Verified Matched Schemes ({result.matchedSchemes?.length || 0}):
                </div>

                {result.matchedSchemes?.map((item, idx) => {
                  const s = item.scheme;
                  const ev = item.evaluation;
                  return (
                    <div
                      key={s._id || idx}
                      className="border border-purple-200 rounded-xl p-4 hover:border-purple-400 bg-white shadow-2xs transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                            {s.level} Govt • {s.category}
                          </span>
                          <h4 className="text-sm font-extrabold text-[#2b0f4c] mt-1">
                            {language === 'hi' && s.nameHi ? s.nameHi : s.name}
                          </h4>
                          <div className="text-xs font-bold text-orange-600 mt-0.5">
                            💰 {s.benefit}
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                          {ev?.matchPercentage || 95}% Match
                        </span>
                      </div>

                      {/* Why this scheme matches */}
                      <div className="bg-gray-50 rounded-lg p-2.5 text-[11px] text-gray-700 space-y-1">
                        <div className="font-bold text-gray-900">Why this scheme?</div>
                        <div className="flex flex-wrap gap-1">
                          {ev?.matchedCriteria?.slice(0, 3).map((c, i) => (
                            <span key={i} className="text-emerald-700 font-semibold mr-2">
                              ✓ {c.detail || c.rule}
                            </span>
                          ))}
                          {ev?.missingDocuments?.map((m, i) => (
                            <span key={i} className="text-orange-700 font-semibold mr-2">
                              ⚠️ {m.title} pending
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenActionPlan?.(s);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                        >
                          <span>View Action Plan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-purple-50 hover:bg-purple-100 text-[#2b0f4c] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 border border-purple-200"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
