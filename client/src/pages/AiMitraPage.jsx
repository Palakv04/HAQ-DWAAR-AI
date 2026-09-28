import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakText, stopSpeaking } from '../utils/speech';

export const AiMitraPage = ({ onOpenActionPlan, onOpenDigiLocker }) => {
  const { language } = useAuth();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('hi-IN');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recognizer, setRecognizer] = useState(null);

  const samplePrompts = [
    'मेरी बेटी की कॉलेज फीस में मदद चाहिए?',
    'मेरे घर की income कम है और मुझे B.Tech की fees के लिए scholarship चाहिए',
    'किसान सम्मान निधि का अगला किस्त कब आएगा?',
    'मुझे अपनी दुकान या सिलाई के लिए टूलकिट चाहिए',
    'बुजुर्गों के लिए पेंशन का फॉर्म कैसे भरें',
    'आयुष्मान भारत कार्ड से 5 लाख का फ्री इलाज कैसे मिलेगा?',
  ];

  useEffect(() => {
    return () => {
      if (recognizer) recognizer.stop();
      stopSpeaking();
    };
  }, [recognizer]);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero Voice Box */}
      <div className="bg-gradient-to-br from-[#230b42] via-[#2d0e53] to-[#1f093b] rounded-3xl p-6 sm:p-10 text-white shadow-haq-lg border border-purple-800/40 relative overflow-hidden flex flex-col items-center text-center space-y-5">
        <div className="inline-flex items-center space-x-2 bg-white/10 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-purple-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI MITRA • जन सहायक वॉइस (ACTIVE)</span>
        </div>

        <div className="flex items-center space-x-2 flex-wrap justify-center gap-y-1">
          <span className="text-xs text-purple-300 font-semibold">Select Local Dialect:</span>
          {[
            { code: 'hi-IN', label: 'हिन्दी' },
            { code: 'hi-IN', label: 'भोजपुरी (Bhojpuri)' },
            { code: 'hi-IN', label: 'मैथिली (Maithili)' },
            { code: 'en-IN', label: 'English' },
          ].map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDialect(d.code)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition ${
                selectedDialect === d.code && i === 0
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-purple-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Large Glowing Mic */}
        <div className="py-2">
          <button
            onClick={toggleListening}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 animate-pulse-mic ring-8 ring-orange-500/30 shadow-orange-500/50'
                : 'bg-gradient-to-tr from-[#ea580c] to-[#f97316] hover:scale-105 shadow-orange-600/40'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white animate-bounce" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
            <span className="text-xs font-black tracking-wide uppercase mt-1">
              {isListening ? 'सुन रहे हैं...' : 'बोलें'}
            </span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            "बोलकर अपनी समस्या बताएं"
          </h1>
          <p className="text-xs sm:text-sm text-purple-300 mt-1">
            Tap &amp; Speak in Local Dialect • Rural Voice Navigation
          </p>
        </div>

        {/* Text Input Search */}
        <div className="w-full max-w-xl">
          <div className="flex items-center bg-white/10 border border-purple-400/40 rounded-2xl p-1.5 focus-within:border-orange-400 transition">
            <Search className="w-5 h-5 text-purple-300 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
              placeholder="या यहाँ टाइप करें: जैसे 'मेरे पास 1.5 एकड़ जमीन है और मुझे लोन चाहिए'..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-purple-300/70 focus:outline-none"
            />
            <button
              onClick={() => handleExecuteQuery()}
              disabled={loading || !query.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black px-5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-md"
            >
              <span>{loading ? 'विश्लेषण...' : 'खोजें (Ask AI)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sample Prompt Chips */}
        <div className="w-full max-w-2xl text-left space-y-2 pt-2">
          <div className="text-xs font-bold text-purple-300">सुझाव (Tap any example):</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleExecuteQuery(p);
                }}
                className="text-left bg-white/5 hover:bg-white/15 border border-purple-500/20 rounded-xl p-2.5 text-xs text-purple-100 flex items-center justify-between transition group"
              >
                <span className="leading-snug">💡 "{p}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-orange-400 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-haq space-y-5 animate-in zoom-in-95 duration-200">
          {/* Fact Extraction Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#2b0f4c]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Intent Understanding &amp; Extraction</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-purple-200 text-purple-900 font-bold px-2.5 py-0.5 rounded-md">
                  Category: {result.structuredIntent?.category?.toUpperCase()}
                </span>
                <span className="bg-orange-100 text-orange-900 font-bold px-2.5 py-0.5 rounded-md">
                  Need: {result.structuredIntent?.need}
                </span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-md">
                  Target: {result.structuredIntent?.targetAudience}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSpeak}
              className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Play Explanation'}</span>
            </button>
          </div>

          {/* Conversational Explanation */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-950 leading-relaxed">
            🗣️ {language === 'hi' ? result.responseMessageHi : result.responseMessage}
          </div>

          {/* Matched Schemes List */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#2b0f4c]">
              सत्यापित योजना परिणाम (Verified Scheme Matches):
            </h3>

            {result.matchedSchemes?.map((item, idx) => {
              const s = item.scheme;
              const ev = item.evaluation;
              return (
                <div
                  key={s._id || idx}
                  className="border border-purple-200 rounded-2xl p-5 hover:border-purple-400 bg-white shadow-xs transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded uppercase">
                        {s.level} Govt • {s.category}
                      </span>
                      <h4 className="text-base font-black text-[#2b0f4c] mt-1">
                        {language === 'hi' && s.nameHi ? s.nameHi : s.name}
                      </h4>
                      <div className="text-xs font-extrabold text-orange-600 mt-0.5">
                        💰 {s.benefit}
                      </div>
                    </div>

                    <span className="bg-emerald-50 text-emerald-800 font-black text-xs px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-center">
                      {ev?.matchPercentage || 95}% Match
                    </span>
                  </div>

                  {/* Why matched */}
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700 space-y-1">
                    <div className="font-bold text-gray-900">Why this scheme?</div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {ev?.matchedCriteria?.map((c, i) => (
                        <span key={i} className="text-emerald-700 font-bold">
                          ✓ {c.detail || c.rule}
                        </span>
                      ))}
                      {ev?.missingDocuments?.map((m, i) => (
                        <span key={i} className="text-orange-700 font-bold">
                          ⚠️ {m.title} missing
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      onClick={() => onOpenActionPlan?.(s)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition"
                    >
                      <span>View Action Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={s.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-50 hover:bg-purple-100 text-[#2b0f4c] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 border border-purple-200 transition"
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
  );
};
