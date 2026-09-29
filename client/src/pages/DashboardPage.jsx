import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Phone,
  Ticket,
  ChevronRight,
  Share2,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  Volume2,
  Lock,
  Flame,
  BadgePercent,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { BenefitReadinessGauge } from '../components/BenefitReadinessGauge';
import { SchemeCard } from '../components/SchemeCard';
import { speakText } from '../utils/speech';
import { demoSchemes } from '../data/demoData';
import { HeroCarousel } from '../components/HeroCarousel';

export const DashboardPage = ({
  onOpenVoiceModal,
  onOpenActionPlan,
  onOpenDigiLocker,
  onOpenCscModal,
  demoJourney,
}) => {
  const { user, profile, readiness, documents, language, activeMode, changeMode } = useAuth();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, [activeMode]);

  const fetchSchemes = async () => {
    try {
      setLoadingSchemes(true);
      const res = await apiClient('/schemes');
      if (res.success) {
        setSchemes(res.schemes);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
      setSchemes(demoSchemes);
    } finally {
      setLoadingSchemes(false);
    }
  };

  const handleModeClick = (mode) => {
    changeMode(mode);
  };

  const filteredSchemes = schemes.filter((s) => {
    if (selectedFilter === 'high_match') return (s.matchPercentage || 0) >= 90;
    if (selectedFilter === 'education') return s.category === 'education';
    if (selectedFilter === 'agriculture') return s.category === 'agriculture';
    if (selectedFilter === 'dbt') return s.benefitType?.toLowerCase().includes('dbt');
    return true;
  });

  const categories = [
    {
      id: 'education',
      mode: 'Student',
      labelEn: 'Education & Scholarships',
      labelHi: 'शिक्षा व छात्रवृत्ति',
      shortLabel: 'पढ़ाई',
      icon: '🎓',
      badge: 'Hot',
      badgeColor: 'bg-orange-500 text-white',
      count: '14 योजनाएं',
    },
    {
      id: 'agriculture',
      mode: 'Kisan',
      labelEn: 'Agriculture & Kisan Grants',
      labelHi: 'खेती व किसान',
      shortLabel: 'खेती',
      icon: '🌾',
      badge: 'DBT Direct',
      badgeColor: 'bg-emerald-600 text-white',
      count: '8 योजनाएं',
    },
    {
      id: 'employment',
      mode: 'Rozgar',
      labelEn: 'Vocational & Toolkit',
      labelHi: 'रोज़गार व कौशल',
      shortLabel: 'रोज़गार',
      icon: '💼',
      badge: 'MSME Aid',
      badgeColor: 'bg-purple-700 text-white',
      count: '11 योजनाएं',
    },
    {
      id: 'health',
      mode: 'Citizen',
      labelEn: 'Ayushman & Health',
      labelHi: 'स्वास्थ्य सुरक्षा',
      shortLabel: 'स्वास्थ्य',
      icon: '🏥',
      badge: '₹5L Cover',
      badgeColor: 'bg-blue-600 text-white',
      count: '6 योजनाएं',
    },
    {
      id: 'social_security',
      mode: 'Citizen',
      labelEn: 'Social Security & Old Age',
      labelHi: 'पेंशन व सुरक्षा',
      shortLabel: 'पेंशन',
      icon: '🛡️',
      badge: 'Direct Cash',
      badgeColor: 'bg-amber-600 text-white',
      count: '5 योजनाएं',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================
          1. TOP HERO SECTION: GREETING & READINESS (DESKTOP & MOBILE)
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Left 2 Cols: Main Citizen Entitlement Hero */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#2b0f4c] via-[#3d156b] to-[#4d1e8d] rounded-3xl p-5 sm:p-7 text-white shadow-haq-lg relative overflow-hidden flex flex-col justify-between">
          {/* Decorative watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <span className="text-[180px] font-black leading-none">₹</span>
          </div>

          <div>
            {/* Top row: Greeting + Rural ID badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-purple-400/20">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👋</span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                    <span>
                      {language === 'hi'
                        ? `नमस्ते, ${profile?.name || user?.name || 'नागरिक'}!`
                        : `Hello, ${profile?.name || user?.name || 'Citizen'}!`}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] bg-orange-500/90 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      {language === 'hi' ? 'सत्यापित नागरिक' : 'Verified Citizen'}
                    </span>
                  </h1>
                  <p className="text-xs text-purple-200 mt-0.5 font-medium">
                    {profile?.district || 'Samastipur'}, {profile?.state || 'Bihar'} • ग्रामीण ID {user?.ruralId || '#0001'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    speakText(
                      language === 'hi'
                        ? `नमस्ते ${profile?.name || user?.name || 'नागरिक'}! आप वार्षिक सरकारी लाभों के लिए पात्र हैं।`
                        : `Hello ${profile?.name || user?.name || 'Citizen'}! You are eligible for annual welfare benefits.`
                    )
                  }
                  className="bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
                  title="Listen in Hindi"
                >
                  <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">सुनें (Audio)</span>
                </button>
              </div>
            </div>

            {/* Total Identified Entitlements */}
            <div className="my-5">
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-200 uppercase tracking-wider">
                <span>TOTAL IDENTIFIED ENTITLEMENTS • कुल अनुमानित सरकारी पात्रता</span>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded">FY 2024-25</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight flex items-baseline space-x-2">
                <span className="text-orange-400">₹48,000+</span>
                <span className="text-xs sm:text-sm font-semibold text-purple-200">
                  वार्षिक सरकारी लाभ (Annual Welfare Benefits)
                </span>
              </div>

              {/* Badges for DBT vs Subsidy */}
              <div className="flex flex-wrap gap-2 mt-3 text-xs font-bold">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>₹36,000 Direct Cash DBT</span>
                </span>
                <span className="bg-purple-400/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-lg flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-300"></span>
                  <span>₹12,000 Tuition &amp; Skill Subsidy</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="pt-4 border-t border-purple-400/20 flex flex-wrap items-center gap-2 text-xs">
            <Link
              to="/applications"
              className="bg-white/15 hover:bg-white/25 text-white font-bold py-2 px-3.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check Application Status (1 Active)</span>
            </Link>

            <button
              onClick={() => alert('Entitlement Certificate generated with verified DigiLocker stamp.')}
              className="bg-white/15 hover:bg-white/25 text-white font-bold py-2 px-3.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">Download Certificate</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                'HaqDwaar AI: Check your citizen welfare benefits & readiness score: https://haqdwaar.gov.in'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold py-2 px-3.5 rounded-xl transition flex items-center space-x-1.5 ml-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Col: Benefit Readiness circular gauge card */}
        <div className="lg:col-span-1 flex flex-col">
          <BenefitReadinessGauge onOpenDigiLockerModal={() => onOpenDigiLocker?.()} />
        </div>
      </section>

      <HeroCarousel
        onOpenVoice={onOpenVoiceModal}
        onOpenDigiLocker={onOpenDigiLocker}
        onOpenPassport={() => navigate('/passport')}
      />

      {demoJourney}

      {/* ========================================================
          2. HERO AI MITRA VOICE CARD (DESKTOP & MOBILE)
         ======================================================== */}
      <section className="bg-gradient-to-r from-[#230b42] via-[#2d0e53] to-[#1f093b] rounded-3xl p-6 sm:p-8 text-white shadow-haq-lg border border-purple-800/40 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-purple-400/30 px-3 py-1.5 rounded-full text-sm font-bold text-purple-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI MITRA • जन सहायक वॉइस (ONLINE)</span>
          </div>

          <p className="text-sm text-purple-300 font-medium">
            Bilingual &amp; Dialect Aware (Hindi, Bhojpuri, Maithili, Magahi, English)
          </p>

          {/* Large Glowing Microphone Button */}
          <div className="pt-2">
            <button
              onClick={() => onOpenVoiceModal?.()}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] text-white flex flex-col items-center justify-center shadow-mic-glow hover:scale-105 active:scale-95 transition-all border-4 border-white/20 animate-pulse-mic"
              aria-label="Speak into AI Mitra"
            >
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <span className="text-[11px] font-black uppercase mt-1 tracking-wider">बोलें</span>
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              "बोलकर अपनी समस्या या जरूरत बताएं"
            </h2>
            <p className="text-sm text-purple-300">
              Click the mic &amp; ask anything in Hindi or regional dialects. No typing needed.
            </p>
          </div>

          {/* Search Bar with AI trigger */}
          <div className="w-full max-w-xl">
            <div className="flex items-center bg-white/10 border border-purple-400/40 rounded-2xl p-1.5 focus-within:border-orange-400 transition">
              <Search className="w-4 h-4 text-purple-300 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    onOpenVoiceModal?.(searchQuery);
                  }
                }}
                placeholder="या यहाँ लिखें: जैसे 'मुझे खाद सब्सिडी या बेटी की छात्रवृत्ति चाहिए'..."
                className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-white placeholder-purple-300/70 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    onOpenVoiceModal?.(searchQuery);
                  } else {
                    onOpenVoiceModal?.();
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-black px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-md"
              >
                <span>खोजें (Ask AI)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm">
            {[
              'मेरी बेटी की कॉलेज फीस में मदद चाहिए?',
              'किसान सम्मान निधि का अगला किस्त कब आएगा?',
              'पीएम आवास योजना ग्रामीण की पात्रता कैसे चेक करें?',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => onOpenVoiceModal?.(p)}
                className="bg-white/5 hover:bg-white/15 border border-purple-400/20 text-purple-100 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition"
              >
                <span>💡 "{p}"</span>
                <ArrowRight className="w-3 h-3 text-orange-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. QUICK LIFE-SITUATION SECTORS (त्वरित श्रेणियां)
         ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌿</span>
            <h2 className="text-lg sm:text-xl font-black text-[#2b0f4c]">
              त्वरित श्रेणियां <span className="text-sm font-semibold text-gray-500">(Life-Situation Sectors)</span>
            </h2>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center space-x-1"
          >
            <span>सभी देखें</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5 Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const isCurrentMode = activeMode === cat.mode;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  handleModeClick(cat.mode);
                  setSelectedFilter(cat.id);
                }}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                  isCurrentMode
                    ? 'border-purple-600 bg-purple-50/90 shadow-md ring-1 ring-purple-400'
                    : 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-2xl flex items-center justify-center group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>

                <div className="text-sm sm:text-base font-black text-[#2b0f4c] leading-tight group-hover:text-purple-900">
                  {language === 'hi' ? cat.labelHi : cat.labelEn}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  {cat.labelEn.split('&')[0]}
                </div>

                <div className="mt-3 text-xs font-bold text-purple-700 flex items-center justify-between border-t border-purple-100/70 pt-2">
                  <span>{cat.count}</span>
                  <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. MAIN TWO-COLUMN CONTENT AREA
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Recommended Schemes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-base">⭐</span>
              <h3 className="text-base font-black text-[#2b0f4c]">
                आपके लिए अनुशंसित शीर्ष योजनाएं{' '}
                <span className="text-xs font-bold text-purple-600">(Top AI Matches)</span>
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-500">
              Total {filteredSchemes.length} Qualified
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Matches (12)' },
              { id: 'high_match', label: 'High Match (>90%)' },
              { id: 'education', label: 'Higher Education' },
              { id: 'agriculture', label: 'Kisan & Agriculture' },
              { id: 'dbt', label: 'Direct DBT Cash' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition ${
                  selectedFilter === f.id
                    ? 'bg-[#2b0f4c] text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-[#4a4458] hover:bg-purple-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Schemes list */}
          <div className="space-y-4">
            {loadingSchemes ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs font-bold text-gray-500">
                Evaluating citizen rules and fetching verified schemes...
              </div>
            ) : filteredSchemes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs font-bold text-gray-500">
                No schemes match the selected filter. Try selecting 'All Matches'.
              </div>
            ) : (
              filteredSchemes.map((scheme, idx) => (
                <SchemeCard
                  key={scheme._id || idx}
                  scheme={scheme}
                  isFeatured={idx === 0}
                  onOpenActionPlan={onOpenActionPlan}
                  onOpenDigiLocker={onOpenDigiLocker}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 Col): DigiLocker Health, CSC Locator, Civic Tip */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
          {/* 1. DigiLocker Vault Health */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-extrabold text-[#2b0f4c]">DigiLocker Vault Health</h4>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Direct API v3.2
              </span>
            </div>

            <p className="text-[11px] text-gray-500">
              Official government repository sync for zero-paper scheme approval.
            </p>

            <div className="space-y-2.5">
              {documents.map((doc) => {
                const isVerified = doc.status === 'verified';
                const isActionNeeded = doc.status === 'action_needed' || doc.status === 'expired';

                return (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 transition bg-[#faf9fc]"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-[#2b0f4c] leading-tight">
                        {language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {doc.issuer} {doc.docNumber ? `• ${doc.docNumber}` : ''}
                      </div>
                    </div>

                    {isVerified ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenDigiLocker?.(doc.docType)}
                        className="text-[10px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-900 px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0 transition"
                      >
                        <span>{doc.status === 'expired' ? 'Re-apply' : 'Fetch'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <Link
              to="/documents"
              className="text-xs font-bold text-purple-700 hover:text-purple-950 flex items-center justify-between pt-2 border-t border-purple-50"
            >
              <span>Manage DigiLocker Vault ({documents.length} Documents)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2. Nearest CSC Kendra Locator */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-700" />
                <h4 className="text-sm font-extrabold text-[#2b0f4c]">निकटतम जन सेवा केंद्र (CSC)</h4>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                1.2 km
              </span>
            </div>

            {/* Map View */}
            <div className="relative rounded-xl overflow-hidden h-32 bg-gray-200 border border-purple-100">
              <iframe
                title="CSC Location Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=83.0,24.0,88.0,27.5&layer=mapnik`}
                className="w-full h-full border-0 opacity-90"
                loading="lazy"
              />
              {/* Pin Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-1.5 flex items-center space-x-1.5 border border-purple-200">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[11px] font-extrabold text-[#2b0f4c]">
                    {profile?.district || 'Nearby'} CSC e-Gov Hub
                  </span>
                </div>
                <div className="w-0.5 h-3 bg-orange-500" />
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-md" />
              </div>
              {/* Open Hours badge */}
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                खुला है (Open today till 7 PM)
              </div>
              {/* Token badge */}
              <div className="absolute bottom-2 left-2 bg-white/90 text-[#2b0f4c] text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow border border-purple-100">
                Token Wait: ~10 mins
              </div>
            </div>

            {/* VLE info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-[10px]">
                  VLE
                </div>
                <div>
                  <div className="font-bold text-gray-900">CSC VLE Operator</div>
                  <div className="text-[10px] text-gray-500">Govt Certified Assistant CSC-VLE</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.5 rounded">
                Top Rated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onOpenCscModal?.()}
                className="bg-white hover:bg-purple-50 text-[#2b0f4c] border border-purple-200 font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center space-x-1 transition"
              >
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>कॉल करें (Call)</span>
              </button>
              <button
                onClick={() => onOpenCscModal?.()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center space-x-1 transition shadow-2xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>बुक टोकन (Token)</span>
              </button>
            </div>
          </div>

          {/* 3. Today's Civic Tip */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-950">
              <span className="text-base">💡</span>
              <span>आज का सुझाव (Today's Civic Tip)</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              बैंक खाते में <strong>NPCI आधार सीडिंग</strong> अवश्य कराएं ताकि 15 अगस्त से पहले छात्रवृत्ति और किसान सम्मान निधि का पैसा बिना रुकावट प्राप्त हो सके।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
