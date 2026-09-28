import express from 'express';
import Scheme from '../models/Scheme.js';
import UserProfile from '../models/UserProfile.js';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
import { extractUserIntent } from '../services/aiService.js';
import { evaluateSchemeEligibility } from '../services/eligibilityEngine.js';

const router = express.Router();

router.post('/query', protect, async (req, res) => {
  try {
    const { query, language = 'hi', inputType = 'voice' } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query cannot be empty' });
    }

    // 1. AI Intent Extraction (Gemini with robust dialect NLP fallback)
    const structuredIntent = await extractUserIntent(query, language);

    // 2. Query MongoDB for candidate verified schemes
    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    const schemeFilter = { active: true };
    if (structuredIntent.category && structuredIntent.category !== 'all') {
      schemeFilter.category = structuredIntent.category;
    }

    let candidateSchemes = await Scheme.find(schemeFilter);
    if (candidateSchemes.length === 0) {
      candidateSchemes = await Scheme.find({ active: true });
    }

    // 3. Deterministic Eligibility Engine (NEVER let LLM invent eligibility or facts)
    const matchedResults = candidateSchemes.map((scheme) => {
      const evaluation = profile
        ? evaluateSchemeEligibility(profile, scheme, documents)
        : null;

      return {
        scheme,
        evaluation,
      };
    });

    // Sort by match percentage descending
    matchedResults.sort(
      (a, b) => (b.evaluation?.matchPercentage || 0) - (a.evaluation?.matchPercentage || 0)
    );

    const topMatches = matchedResults.slice(0, 3);

    // 4. Generate helpful conversational response
    const topScheme = topMatches[0]?.scheme;
    const topEval = topMatches[0]?.evaluation;

    let responseMessage = '';
    let responseMessageHi = '';

    if (topScheme && topEval) {
      responseMessage = `We found ${topMatches.length} government schemes matching your requirement. Highest match is "${topScheme.name}" with a ${topEval.matchPercentage}% qualification readiness. ${topEval.missingDocuments.length > 0 ? `Note: ${topEval.missingDocuments.length} document(s) need verification via DigiLocker.` : 'All required certificates are ready!'}`;
      responseMessageHi = `आपकी जरूरत के अनुसार हमने ${topMatches.length} सरकारी योजनाएं खोजी हैं। सबसे उपयुक्त "${topScheme.nameHi || topScheme.name}" है (पात्रता: ${topEval.matchPercentage}%)। ${topEval.missingDocuments.length > 0 ? `ध्यान दें: ${topEval.missingDocuments.length} दस्तावेज़ डिजिलॉकर से सिंक करना शेष है।` : 'आपके सभी आवश्यक प्रमाण पत्र सत्यापित हैं!'}`;
    } else {
      responseMessage = 'Here are verified government schemes aligned with your profile and query.';
      responseMessageHi = 'आपकी प्रोफाइल और जरूरत के अनुसार सत्यापित सरकारी योजनाएं नीचे दी गई हैं।';
    }

    res.json({
      success: true,
      query,
      inputType,
      language,
      structuredIntent,
      responseMessage,
      responseMessageHi,
      matchedSchemes: topMatches,
      totalFound: matchedResults.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
