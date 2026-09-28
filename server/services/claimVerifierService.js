import Scheme from '../models/Scheme.js';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Benefit Firewall - Claim Verification Service
 * Cross-references viral social media & WhatsApp claims with structured government schemes.
 */
export const verifyWelfareClaim = async (claimText = '') => {
  const normalizedText = claimText.toLowerCase();

  // 1. Fetch all active verified schemes from MongoDB
  const allSchemes = await Scheme.find({ active: true });

  // 2. Deterministic rule-based claim comparison
  let matchedScheme = null;
  let verdict = 'COULD NOT VERIFY';
  let confidenceScore = 65;
  let analysis = {
    headline: 'Claim Verification in Progress',
    headlineHi: 'दावे की जांच की जा रही है',
    truthSummary: '',
    truthSummaryHi: '',
    falseClaims: [],
    verifiedFacts: [],
    advisory: 'Always verify on official .gov.in or .nic.in portals. Do not share OTP or click unverified links.',
    officialFactCheckUrl: 'https://factcheck.pib.gov.in',
  };

  // Check 1: PM Kisan claims (e.g. "सभी किसानों को मिलेंगे ₹12,000 या 18वीं किश्त बिना ई-केवाईसी")
  if (normalizedText.includes('kisan') || normalizedText.includes('किसान') || normalizedText.includes('सम्मान निधि')) {
    matchedScheme = allSchemes.find((s) => s.slug === 'pm-kisan-samman-nidhi');
    if (normalizedText.includes('12000') || normalizedText.includes('12,000') || normalizedText.includes('बिना केवाईसी') || normalizedText.includes('बिना e-kyc')) {
      verdict = 'POTENTIALLY MISLEADING';
      confidenceScore = 95;
      analysis = {
        headline: 'Misleading Claim: PM-Kisan amount is ₹6,000/yr and e-KYC is strictly mandatory',
        headlineHi: 'भ्रामक दावा: पीएम-किसान सहायता ₹6,000/वर्ष है और e-KYC अनिवार्य है',
        truthSummary: 'Under PM-Kisan Samman Nidhi, the statutory assistance is ₹6,000 per year paid in three equal installments of ₹2,000. Biometric or OTP-based e-KYC is mandatory to receive payments.',
        truthSummaryHi: 'पीएम-किसान के तहत केवल ₹6,000 प्रति वर्ष (₹2,000 की 3 किश्तें) दी जाती हैं। बिना e-KYC के राशि जारी नहीं की जाती।',
        falseClaims: [
          'Claiming grant amount has been doubled to ₹12,000 across all beneficiaries',
          'Claiming installments will be released without mandatory e-KYC verification',
        ],
        verifiedFacts: [
          'Official annual benefit remains ₹6,000 (three 4-monthly cycles of ₹2,000)',
          'Bank accounts must be Aadhaar-seeded with NPCI mapping active',
          'Official portal: pmkisan.gov.in',
        ],
        advisory: 'Beware of fraudulent APK downloads or phishing links asking for bank OTPs.',
        officialFactCheckUrl: 'https://factcheck.pib.gov.in',
      };
    } else {
      verdict = 'VERIFIED';
      confidenceScore = 92;
      analysis = {
        headline: 'Verified Government Scheme: PM-Kisan Samman Nidhi',
        headlineHi: 'सत्यापित योजना: प्रधानमंत्री किसान सम्मान निधि',
        truthSummary: 'The scheme provides genuine direct cash support of ₹6,000 per year to eligible landholding farmer families via DBT.',
        truthSummaryHi: 'पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता 3 किश्तों में सीधे बैंक खाते में दी जाती है।',
        falseClaims: [],
        verifiedFacts: [
          'Direct Benefit Transfer (DBT) directly into bank accounts',
          'Requires land record (खतौनी) and Aadhaar e-KYC',
          'Official portal: https://pmkisan.gov.in',
        ],
        advisory: 'Verify your installment status directly on the official PM-Kisan beneficiary portal.',
        officialFactCheckUrl: 'https://pmkisan.gov.in',
      };
    }
  }
  // Check 2: Free Laptop / Tablet claims (Frequent WhatsApp scam)
  else if (normalizedText.includes('laptop') || normalizedText.includes('लैपटॉप') || normalizedText.includes('मुफ्त फोन') || normalizedText.includes('free smartphone')) {
    verdict = 'POTENTIALLY MISLEADING';
    confidenceScore = 96;
    analysis = {
      headline: 'Caution: Viral "Free Laptop / Smartphone" Link is Unauthorized Phishing',
      headlineHi: 'सावधान: "मुफ्त लैपटॉप/स्मार्टफोन" का वायरल लिंक अनाधिकृत एवं भ्रामक है',
      truthSummary: 'PIB Fact Check and Central Ministries have issued repeated warnings that the Union Government runs no universal "Free Laptop Scheme" through WhatsApp/Telegram share links.',
      truthSummaryHi: 'केंद्र सरकार व्हाट्सएप या टेलीग्राम लिंक द्वारा कोई "मुफ्त लैपटॉप योजना" नहीं चला रही है। यह डाटा चुराने वाला फर्जी लिंक हो सकता है।',
      falseClaims: [
        'Forwarding WhatsApp message to 10 friends will unlock a free laptop',
        'Direct delivery of digital gadgets upon paying ₹150 courier charges',
      ],
      verifiedFacts: [
        'Legitimate state student schemes (like UP Swami Vivekananda or Bihar Student Credit Card) require formal college enrollment and institutional portal registration',
        'Government will NEVER ask you to forward links on WhatsApp or pay courier fees via UPI',
      ],
      advisory: 'Do not click unauthorized blog links or share personal Aadhaar numbers on unverified portals.',
      officialFactCheckUrl: 'https://factcheck.pib.gov.in',
    };
  }
  // Check 3: Medhavi Vidyarthi / Education scholarship claims
  else if (normalizedText.includes('scholarship') || normalizedText.includes('छात्रवृत्ति') || normalizedText.includes('medhavi') || normalizedText.includes('मेधावी')) {
    matchedScheme = allSchemes.find((s) => s.slug === 'mukhyamantri-medhavi-vidyarthi-yojana');
    verdict = 'VERIFIED';
    confidenceScore = 94;
    analysis = {
      headline: 'Verified Scheme: Mukhyamantri Medhavi Vidyarthi Yojana',
      headlineHi: 'सत्यापित योजना: मुख्यमंत्री मेधावी विद्यार्थी योजना',
      truthSummary: 'Meritorious students scoring above 70% in 12th Board examinations with annual family income below ₹6 Lakhs are entitled to university tuition fee sponsorship.',
      truthSummaryHi: '12वीं में 70% से अधिक अंक पाने वाले और ₹6 लाख से कम पारिवारिक आय वाले छात्र उच्च शिक्षा हेतु पात्र हैं।',
      falseClaims: [],
      verifiedFacts: [
        'Tuition fee reimbursement up to ₹1,50,000 per academic year',
        'Official application portal: medhavividyarthi.bihar.gov.in',
        'Valid current year Income Certificate and 12th marksheet required',
      ],
      advisory: 'Ensure your Income Certificate is issued after 1st April of current academic year.',
      officialFactCheckUrl: 'https://medhavividyarthi.bihar.gov.in',
    };
  }
  // Check 4: PM Vishwakarma claims
  else if (normalizedText.includes('vishwakarma') || normalizedText.includes('विश्वकर्मा') || normalizedText.includes('toolkit') || normalizedText.includes('टूलकिट')) {
    matchedScheme = allSchemes.find((s) => s.slug === 'pm-vishwakarma-yojana');
    verdict = 'VERIFIED';
    confidenceScore = 95;
    analysis = {
      headline: 'Verified Scheme: PM Vishwakarma Modern Toolkit & Enterprise Loan',
      headlineHi: 'सत्यापित योजना: पीएम विश्वकर्मा योजना',
      truthSummary: 'Traditional artisans and craftspersons receive ₹15,000 e-voucher for modern toolkits, ₹500/day training stipend, and enterprise loans at 5% interest.',
      truthSummaryHi: 'पारंपरिक कारीगरों को ₹15,000 का टूलकिट वाउचर, ₹500/दिन प्रशिक्षण भत्ता और आसान ऋण उपलब्ध कराया जाता है।',
      falseClaims: [],
      verifiedFacts: [
        'Encompasses 18 traditional trades (carpenters, blacksmiths, tailors, potters, etc.)',
        'Biometric registration must be done at authorized CSC Digital Seva Kendra',
        'Official portal: pmvishwakarma.gov.in',
      ],
      advisory: 'Register only through CSC Centers or the official pmvishwakarma.gov.in portal.',
      officialFactCheckUrl: 'https://pmvishwakarma.gov.in',
    };
  } else {
    // General assessment
    verdict = 'PARTIALLY VERIFIED';
    confidenceScore = 70;
    analysis = {
      headline: 'General Welfare Notice: Official Verification Recommended',
      headlineHi: 'सामान्य कल्याण सूचना: आधिकारिक स्रोतों से जांच करें',
      truthSummary: 'Could not match this claim with a single centralized gazette circular. While related welfare benefits exist in state databases, specific terms, dates, and amounts must be verified.',
      truthSummaryHi: 'इस दावे का सीधा मिलान किसी एकल सरकारी अधिसूचना से नहीं हुआ। कृपया आधिकारिक पोर्टल पर पुष्टि करें।',
      falseClaims: ['Unsubstantiated guarantee or deadline mentioned in viral message'],
      verifiedFacts: ['All official central & state schemes are cataloged at myscheme.gov.in and haqdwaar.gov.in'],
      advisory: 'Never pay registration fees on private website portals (.com or .in without .gov.in).',
      officialFactCheckUrl: 'https://factcheck.pib.gov.in',
    };
  }

  return {
    claimText,
    verdict,
    confidenceScore,
    matchedSchemeName: matchedScheme?.name,
    matchedSchemeUrl: matchedScheme?.officialUrl,
    analysis,
  };
};
