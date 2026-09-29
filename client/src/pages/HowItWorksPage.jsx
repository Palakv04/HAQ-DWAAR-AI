import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileCheck2,
  FileSearch,
  KeyRound,
  Landmark,
  ListChecks,
  Mic,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UserRound,
  Fingerprint,
} from 'lucide-react';

const journey = [
  { number: '01', title: 'Create your Benefit Passport', text: 'Add simple details such as location, education, occupation, income and available documents. This becomes your reusable profile.', action: 'Build your passport', to: '/passport', icon: UserRound, color: 'orange' },
  { number: '02', title: 'Tell us what is happening', text: 'Speak or type naturally in your language. For example: “I need help with my B.Tech fees.” You do not need to know a scheme name.', action: 'Talk to AI Mitra', to: '/ai-mitra', icon: Mic, color: 'purple' },
  { number: '03', title: 'Find a potential match', text: 'HaqDwaar compares your situation with structured, verified scheme rules and explains why an opportunity may be relevant to you.', action: 'Explore schemes', to: '/schemes', icon: Sparkles, color: 'green' },
  { number: '04', title: 'Check your documents', text: 'See what is missing, sync available documents through DigiLocker, and review possible mismatches that need your verification.', action: 'Check documents', to: '/documents', icon: FileCheck2, color: 'blue' },
  { number: '05', title: 'Get ready with an action plan', text: 'HaqDwaar turns the requirements into practical next steps: fetch, upload, verify, review and prepare your application.', action: 'View applications', to: '/applications', icon: ListChecks, color: 'rose' },
  { number: '06', title: 'Apply on the official portal', text: 'Follow the official application link and track your saved opportunity and deadlines in HaqDwaar. The final decision remains with the authority.', action: 'Open the live demo', to: '/', icon: Landmark, color: 'teal' },
];

const features = [
  ['Benefit Passport', 'A personal profile that makes every recommendation more relevant.', UserRound],
  ['Life Situation Matching', 'Start with your real need instead of searching for a scheme name.', Sparkles],
  ['Voice-first AI Mitra', 'Speak naturally and get guided help in a simple conversation.', Mic],
  ['Verified Scheme Discovery', 'Compare structured benefit information and official sources.', Landmark],
  ['Notification Impact', 'Turn a long government notification into personal next steps.', FileSearch],
  ['Document Health', 'Find missing documents and possible inconsistencies before applying.', ScanLine],
  ['Application Readiness', 'See how ready you are across eligibility, documents and information.', CheckCircle2],
  ['Personal Action Plan', 'Follow a clear checklist from preparation to submission.', ListChecks],
  ['Benefit Firewall', 'Check circulating claims against the verified information available.', ShieldCheck],
  ['Why This Match?', 'Understand why an opportunity appears on your dashboard.', KeyRound],
  ['Opportunity Radar', 'See new matches, categories and pending actions in one place.', BellRing],
  ['Deadline Tracker', 'Keep approaching deadlines and application status visible.', BellRing],
  ['Scheme Comparison', 'Compare benefits, documents, deadlines and application methods.', FileSearch],
];

const hindiJourney = [
  { number: '01', title: 'अपना लाभ पासपोर्ट बनाएं', text: 'स्थान, शिक्षा, व्यवसाय, आय और उपलब्ध दस्तावेज़ जैसी सरल जानकारी जोड़ें। यह आपका दोबारा उपयोग होने वाला प्रोफ़ाइल बन जाता है।', action: 'पासपोर्ट बनाएं', to: '/passport', icon: UserRound, color: 'orange' },
  { number: '02', title: 'बताएं कि आपकी जरूरत क्या है', text: 'अपनी भाषा में स्वाभाविक रूप से बोलें या लिखें। उदाहरण: “मुझे B.Tech की फीस के लिए मदद चाहिए।” आपको योजना का नाम जानना जरूरी नहीं है।', action: 'AI Mitra से बात करें', to: '/ai-mitra', icon: Mic, color: 'purple' },
  { number: '03', title: 'आपके लिए संभावित योजना खोजें', text: 'HaqDwaar आपकी स्थिति की तुलना सत्यापित योजना नियमों से करता है और बताता है कि कोई अवसर आपके लिए क्यों उपयोगी हो सकता है।', action: 'योजनाएं देखें', to: '/schemes', icon: Sparkles, color: 'green' },
  { number: '04', title: 'अपने दस्तावेज़ जांचें', text: 'देखें कि कौन सा दस्तावेज़ कम है, DigiLocker से उपलब्ध दस्तावेज़ जोड़ें और संभावित असंगतियों की जांच करें।', action: 'दस्तावेज़ जांचें', to: '/documents', icon: FileCheck2, color: 'blue' },
  { number: '05', title: 'कार्ययोजना से तैयार हों', text: 'HaqDwaar सभी जरूरी कामों को आसान चरणों में बदलता है: प्राप्त करें, अपलोड करें, सत्यापित करें, समीक्षा करें और आवेदन तैयार करें।', action: 'आवेदन देखें', to: '/applications', icon: ListChecks, color: 'rose' },
  { number: '06', title: 'आधिकारिक पोर्टल पर आवेदन करें', text: 'आधिकारिक आवेदन लिंक पर जाएं और अपने अवसर व समय-सीमा को HaqDwaar में ट्रैक करें। अंतिम निर्णय संबंधित विभाग का रहेगा।', action: 'लाइव डेमो खोलें', to: '/', icon: Landmark, color: 'teal' },
];

const hindiFeatures = [
  ['लाभ पासपोर्ट', 'एक व्यक्तिगत प्रोफ़ाइल जो हर सुझाव को आपके लिए अधिक उपयोगी बनाती है।'],
  ['जीवन-स्थिति मिलान', 'योजना का नाम खोजने के बजाय अपनी असली जरूरत से शुरुआत करें।'],
  ['वॉइस-फर्स्ट AI Mitra', 'स्वाभाविक रूप से बोलें और बातचीत में मार्गदर्शन पाएं।'],
  ['सत्यापित योजना खोज', 'सत्यापित जानकारी और आधिकारिक स्रोतों की तुलना करें।'],
  ['सूचना का व्यक्तिगत प्रभाव', 'लंबी सरकारी सूचना को अपने लिए जरूरी अगले कदमों में बदलें।'],
  ['दस्तावेज़ स्वास्थ्य', 'आवेदन से पहले कम दस्तावेज़ और संभावित असंगतियां खोजें।'],
  ['आवेदन तैयारी स्कोर', 'पात्रता, दस्तावेज़ और जानकारी के आधार पर अपनी तैयारी देखें।'],
  ['व्यक्तिगत कार्ययोजना', 'तैयारी से आवेदन तक स्पष्ट चेकलिस्ट का पालन करें।'],
  ['लाभ सुरक्षा जांच', 'प्रचलित दावों को उपलब्ध सत्यापित जानकारी से जांचें।'],
  ['यह सुझाव क्यों?', 'समझें कि कोई अवसर आपके डैशबोर्ड पर क्यों दिख रहा है।'],
  ['अवसर रडार', 'नए मिलान, श्रेणियां और लंबित काम एक ही जगह देखें।'],
  ['समय-सीमा ट्रैकर', 'आने वाली समय-सीमा और आवेदन की स्थिति हमेशा सामने रखें।'],
  ['योजना तुलना', 'लाभ, दस्तावेज़, समय-सीमा और आवेदन के तरीकों की तुलना करें।'],
];

export function HowItWorksPage() {
  const { language } = useAuth();
  const isHindi = language === 'hi';
  const pageJourney = isHindi ? hindiJourney : journey;
  const pageFeatures = isHindi ? hindiFeatures.map(([title, text], index) => [title, text, features[index][2]]) : features;
  return (
    <div className="how-it-works-page pb-12">
      <section className="how-hero">
        <div className="how-hero__copy">
          <span className="how-kicker">{isHindi ? 'HAQ DWAAR का विचार' : 'THE HAQ DWAAR IDEA'}</span>
          <h1>{isHindi ? '“मुझे मदद चाहिए” से “अब मुझे अगला कदम पता है।”' : 'From “I need help” to “I know what to do next.”'}</h1>
          <p className="how-hero__lead">{isHindi ? 'HaqDwaar नागरिकों को सरकारी लाभों तक पहुंचने में मदद करने वाला मंच है। यह बताता है कि कौन सा लाभ आपके लिए उपयोगी हो सकता है, क्यों उपयोगी है, कौन से दस्तावेज़ चाहिए और आधिकारिक आवेदन कहां करना है।' : 'HaqDwaar is a citizen-benefit navigation platform. It helps people discover what may be relevant, understand why, prepare their documents and reach the official application channel.'}</p>
          <div className="how-hero__actions"><Link to="/" className="how-primary-action">{isHindi ? 'लाइव डैशबोर्ड डेमो देखें' : 'See the live dashboard demo'} <ArrowRight size={17} /></Link><span className="how-note"><ShieldCheck size={16} /> {isHindi ? 'अंतिम निर्णय आधिकारिक पोर्टल का है' : 'Official portals remain the final authority'}</span></div>
        </div>
        <div className="how-hero__visual" aria-label="HaqDwaar workflow summary">
          <div className="how-hero__orbit how-hero__orbit--one" /><div className="how-hero__orbit how-hero__orbit--two" />
          <div className="how-hero__center"><Fingerprint className="how-hero__fingerprint" aria-label="HaqDwaar fingerprint identity" /><strong>HaqDwaar</strong><small>Citizen journey</small></div>
          <div className="how-hero__node how-hero__node--top"><Mic size={16} /> Speak</div><div className="how-hero__node how-hero__node--right"><Sparkles size={16} /> Match</div><div className="how-hero__node how-hero__node--bottom"><FileCheck2 size={16} /> Ready</div><div className="how-hero__node how-hero__node--left"><Landmark size={16} /> Apply</div>
        </div>
      </section>

      <section className="how-section how-story"><div><span className="how-kicker">{isHindi ? 'यह क्यों जरूरी है' : 'WHY THIS MATTERS'}</span><h2>{isHindi ? 'सरकारी लाभ मौजूद हैं। मुश्किल हिस्सा उन तक पहुंचना है।' : 'Government benefits exist. The difficult part is reaching them.'}</h2></div><div className="how-story__text"><p>{isHindi ? 'नागरिकों को अक्सर पता नहीं होता कि उनके जीवन के लिए कौन सी योजना सही है, कौन से दस्तावेज़ चाहिए या अवसर मिलने के बाद आगे क्या करना है।' : 'Citizens often do not know which scheme fits their life, which documents are needed, or what to do after finding an opportunity.'}</p><p>{isHindi ? 'HaqDwaar इस दूरी को कम करता है। यह AI से नागरिक की बात समझता है, सत्यापित जानकारी से अवसर मिलाता है और अगला कदम स्पष्ट करता है।' : 'HaqDwaar closes that gap. It uses AI to understand a citizen’s words, verified data to match opportunities, and practical guidance to make the next step clear.'}</p></div></section>

      <section className="how-section"><div className="how-section__heading"><div><span className="how-kicker">{isHindi ? 'पूरी यात्रा' : 'THE COMPLETE JOURNEY'}</span><h2>{isHindi ? 'एक मार्गदर्शित यात्रा, कदम-दर-कदम।' : 'One guided flow, step by step.'}</h2></div><p>{isHindi ? 'हर चरण नागरिक को आधिकारिक आवेदन के करीब ले जाता है। डेमो का कोई भी चरण चुनकर उसे आजमाएं।' : 'Each step moves the citizen closer to an official application. Select any step to use that part of the demo.'}</p></div><div className="how-steps">{pageJourney.map(({ number, title, text, action, to, icon: Icon, color }, index) => <article className={`how-step how-step--${color || journey[index].color}`} key={number}><div className="how-step__number">{number}</div><div className="how-step__icon"><Icon size={21} /></div><h3>{title}</h3><p>{text}</p><Link to={journey[index].to}>{action} <ArrowRight size={15} /></Link></article>)}</div></section>

      <section className="how-section"><div className="how-section__heading"><div><span className="how-kicker">{isHindi ? 'मंच क्या करता है' : 'WHAT THE PLATFORM DOES'}</span><h2>{isHindi ? 'यात्रा को आसान बनाने वाली सुविधाएं।' : 'Features that support the journey.'}</h2></div><p>{isHindi ? 'HaqDwaar केवल योजनाओं की सूची नहीं है। यह खोज, तैयारी और कार्रवाई को एक साथ जोड़ता है।' : 'HaqDwaar is more than a list of schemes. It connects discovery, readiness and action.'}</p></div><div className="how-features">{pageFeatures.map(([title, text, Icon]) => <article className="how-feature" key={title}><Icon size={19} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="how-demo-banner"><div><span className="how-kicker">{isHindi ? 'किसी को डेमो दिखाना है?' : 'READY TO SHOW SOMEONE?'}</span><h2>{isHindi ? 'प्रतीक की पूरी डेमो यात्रा देखें।' : 'Walk through Pratik’s real demo journey.'}</h2><p>{isHindi ? 'डैशबोर्ड डेमो पासपोर्ट, आवाज से जानकारी, सत्यापित मिलान, दस्तावेज़ स्वास्थ्य और आवेदन ट्रैकिंग को एक ही यात्रा में जोड़ता है।' : 'The dashboard demo connects passport, voice input, verified matching, document health and application tracking in one flow.'}</p></div><Link to="/" className="how-primary-action">{isHindi ? 'डेमो शुरू करें' : 'Start the demo'} <ArrowRight size={17} /></Link></section>
    </div>
  );
}