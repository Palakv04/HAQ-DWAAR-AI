import express from 'express';
import ClaimVerification from '../models/ClaimVerification.js';
import { protect } from '../middleware/auth.js';
import { verifyWelfareClaim } from '../services/claimVerifierService.js';

const router = express.Router();

const trendingRumors = [
  {
    id: 'rumor-pmkisan-12000',
    title: 'पीएम-किसान की किश्त ₹2,000 से बढ़ाकर ₹4,000 (वार्षिक ₹12,000) कर दी गई है और बिना e-KYC के जारी होगी',
    claimText: 'सभी किसान भाइयों के लिए बड़ी खुशखबरी! सरकार ने किसान सम्मान निधि की राशि ₹6000 से बढ़ाकर ₹12000 कर दी है। अब बिना e-KYC के अगली किश्त ₹4000 सीधे खाते में आएगी। नीचे दिए गए लिंक पर तुरंत क्लिक करें।',
    category: 'agriculture',
  },
  {
    id: 'rumor-free-laptop',
    title: 'मुफ्त स्मार्टफोन व लैपटॉप वितरण योजना 2024: 10 दोस्तों को शेयर करें',
    claimText: 'भारत सरकार की नई फ्री लैपटॉप योजना 2024 के तहत सभी 10वीं व 12वीं पास छात्रों को मिलेगा फ्री लैपटॉप और स्मार्टफोन। केवल ₹149 डिलीवरी चार्ज देकर अपना रजिस्ट्रेशन पक्का करें। ऑफर सीमित समय तक।',
    category: 'education',
  },
  {
    id: 'verified-medhavi-scholarship',
    title: 'बिहार मुख्यमंत्री मेधावी विद्यार्थी योजना: 70%+ अंक पर उच्च शिक्षा फीस सहायता',
    claimText: 'बिहार सरकार मेधावी विद्यार्थी योजना के तहत 12वीं में 70% से अधिक अंक पाने वाले छात्रों को बीटेक और उच्च शिक्षा की फीस ₹1.5 लाख प्रतिवर्ष तक सहायता दे रही है।',
    category: 'education',
  },
];

// GET trending claims for instant demo verification
router.get('/trending', protect, (req, res) => {
  res.json({
    success: true,
    trendingRumors,
  });
});

// POST verify a claim
router.post('/verify', protect, async (req, res) => {
  try {
    const { claimText } = req.body;

    if (!claimText || claimText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide welfare claim text' });
    }

    const verificationResult = await verifyWelfareClaim(claimText);

    // Save record to DB
    const saved = await ClaimVerification.create({
      user: req.user?._id,
      claimText,
      verdict: verificationResult.verdict,
      confidenceScore: verificationResult.confidenceScore,
      matchedSchemeName: verificationResult.matchedSchemeName,
      matchedSchemeUrl: verificationResult.matchedSchemeUrl,
      analysis: verificationResult.analysis,
    });

    res.json({
      success: true,
      result: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET past verified claims by citizen
router.get('/history', protect, async (req, res) => {
  try {
    const history = await ClaimVerification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
