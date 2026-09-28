import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, FileCheck2, Mic, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { demoSchemes } from '../data/demoData';
import { useAuth } from '../context/AuthContext';

const steps = [
  { id: 'passport', label: 'Benefit Passport', icon: UserRound, detail: 'Student • Bihar • income ₹1.6L' },
  { id: 'situation', label: 'Life Situation', icon: Mic, detail: '“B.Tech fees ke liye help chahiye”' },
  { id: 'match', label: 'Verified Match', icon: Sparkles, detail: '94% potential match found' },
  { id: 'ready', label: 'Document Health', icon: FileCheck2, detail: '1 document needs attention' },
  { id: 'apply', label: 'Apply & Track', icon: ShieldCheck, detail: 'Official portal + status tracker' },
];

export const DemoJourney = ({ onOpenVoiceModal, onOpenActionPlan, onOpenDigiLocker, onOpenPassport, onOpenApplications }) => {
  const { language, t } = useAuth();
  const isHindi = language === 'hi';
  const [activeStep, setActiveStep] = useState(0);
  const scheme = demoSchemes[0];
  const advance = (nextStep, action) => { action?.(); setActiveStep(nextStep); };

  return (
    <section className="demo-journey" aria-labelledby="demo-journey-title">
      <div className="demo-journey__intro">
        <div><span className="eyebrow"><span className="eyebrow__dot" /> {t('liveProductDemo')}</span><h2 id="demo-journey-title">{t('demoTitle')}</h2><p>{t('demoIntro')}</p></div>
        <div className="demo-journey__counter"><strong>{activeStep + 1}</strong><span>/ 5 {t('demoStepCount')}</span></div>
      </div>
      <div className="journey-rail">
        {steps.map((step, index) => { const Icon = step.icon; const done = index < activeStep; const current = index === activeStep; return <button key={step.id} className={`journey-step ${current ? 'is-current' : ''} ${done ? 'is-done' : ''}`} onClick={() => setActiveStep(index)}><span className="journey-step__icon">{done ? <CheckCircle2 size={16} /> : <Icon size={16} />}</span><span className="journey-step__copy"><strong>{step.label}</strong><small>{step.detail}</small></span></button>; })}
      </div>
      <div className="journey-stage">
        {activeStep === 0 && <><div><span className="stage-kicker">{isHindi ? 'चरण 01 / नागरिक से शुरुआत' : 'STEP 01 / START WITH THE CITIZEN'}</span><h3>{isHindi ? 'प्रतीक का लाभ पासपोर्ट सही जानकारी का आधार है।' : "Pratik's Benefit Passport is the source of truth."}</h3><p>{isHindi ? 'स्थान, शिक्षा, आय और दस्तावेज़ मिलकर एक उपयोगी प्रोफ़ाइल बनाते हैं। योजना का नाम जानना जरूरी नहीं है।' : 'Location, education, income and documents create a reusable profile. No scheme name required.'}</p></div><button onClick={() => advance(1, onOpenPassport)}>{t('reviewPassport')} <ArrowRight size={16} /></button></>}
        {activeStep === 1 && <><div><span className="stage-kicker">{isHindi ? 'चरण 02 / आवाज से जानकारी' : 'STEP 02 / BHASHINI-READY INPUT'}</span><h3>{isHindi ? '“मेरे घर की आय कम है और B.Tech की फीस के लिए मदद चाहिए।”' : '“Mere ghar ki income kam hai aur B.Tech ki fees chahiye.”'}</h3><p>{isHindi ? 'AI Mitra शिक्षा, जरूरत और आय की जानकारी समझकर सत्यापित नियम इंजन से मिलान करता है।' : 'AI Mitra extracts education, need and income signals, then asks the verified rules engine to match them.'}</p></div><button onClick={() => advance(2, () => onOpenVoiceModal?.('मेरे घर की income कम है और B.Tech की fees के लिए scholarship चाहिए'))}>{t('askAiMitra')} <Mic size={16} /></button></>}
        {activeStep === 2 && <><div><span className="stage-kicker">{isHindi ? 'चरण 03 / समझने योग्य मिलान' : 'STEP 03 / EXPLAINABLE MATCHING'}</span><h3>{isHindi ? `${scheme.nameHi || scheme.name} 94% संभावित मिलान है।` : `${scheme.name} is a 94% potential match.`}</h3><p>{isHindi ? 'क्यों: निवास, 78.4% अंक और आय की शर्त मिलती हुई दिखाई देती है। अंतिम स्रोत आधिकारिक विभाग है।' : 'Why: Bihar domicile, 78.4% marks and income condition appear to match. The official source remains the final authority.'}</p></div><button onClick={() => advance(3, () => onOpenActionPlan?.(scheme))}>{t('personalImpact')} <ArrowRight size={16} /></button></>}
        {activeStep === 3 && <><div><span className="stage-kicker">{isHindi ? 'चरण 04 / दस्तावेज़ स्वास्थ्य' : 'STEP 04 / DOCUMENT HEALTH'}</span><h3>{isHindi ? 'एक जरूरी दस्तावेज़ जमा करने से रोक रहा है।' : 'One missing item is blocking submission.'}</h3><p>{isHindi ? 'आय प्रमाण पत्र उपलब्ध नहीं है। DigiLocker से इसे जोड़ा जा सकता है; संभावित असंगतियां जांच के लिए दिखाई जाती हैं।' : 'Income Certificate is missing. DigiLocker sync can fetch it; possible mismatches are always shown as items to verify.'}</p></div><button onClick={() => advance(4, () => onOpenDigiLocker?.('income_certificate'))}>{t('syncDigiLocker')} <ShieldCheck size={16} /></button></>}
        {activeStep === 4 && <><div><span className="stage-kicker">{isHindi ? 'चरण 05 / आधिकारिक आवेदन' : 'STEP 05 / OFFICIAL APPLICATION'}</span><h3>{isHindi ? 'अब सरकारी पोर्टल पर आगे बढ़ने के लिए तैयार हैं।' : 'Ready to continue on the government portal.'}</h3><p>{isHindi ? 'अवसर को सेव करें, HaqDwaar में स्थिति देखें और आधिकारिक चैनल पर अंतिम आवेदन पूरा करें।' : 'Save the opportunity, track its status in HaqDwaar, and complete the final submission on the official channel.'}</p></div><button onClick={() => onOpenApplications?.()}>{t('applicationTracker')} <ArrowRight size={16} /></button></>}
      </div>
    </section>
  );
};