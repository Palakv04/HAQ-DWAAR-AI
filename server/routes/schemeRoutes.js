import express from 'express';
import Scheme from '../models/Scheme.js';
import UserProfile from '../models/UserProfile.js';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
import { evaluateSchemeEligibility } from '../services/eligibilityEngine.js';

const router = express.Router();

// GET all schemes with deterministic citizen match scores
router.get('/', protect, async (req, res) => {
  try {
    const { category, level, search, mode } = req.query;

    const filter = { active: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (level && level !== 'all') {
      filter.level = level;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameHi: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const schemes = await Scheme.find(filter);
    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    // Deterministically score each scheme against citizen passport
    const scoredSchemes = schemes.map((scheme) => {
      if (!profile) return scheme.toObject();

      const evaluation = evaluateSchemeEligibility(profile, scheme, documents);
      return {
        ...scheme.toObject(),
        matchPercentage: evaluation.matchPercentage,
        docReadinessScore: evaluation.docReadinessScore,
        compositeReadiness: evaluation.compositeReadiness,
        isHighlyEligible: evaluation.isHighlyEligible,
        matchedCriteria: evaluation.matchedCriteria,
        pendingCriteria: evaluation.pendingCriteria,
        missingDocuments: evaluation.missingDocuments,
        whyMatchedSummary: evaluation.whyMatchedSummary,
      };
    });

    // Sort by match percentage descending
    scoredSchemes.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    res.json({
      success: true,
      count: scoredSchemes.length,
      schemes: scoredSchemes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single scheme details by ID or slug
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    let scheme;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      scheme = await Scheme.findById(id);
    } else {
      scheme = await Scheme.findOne({ slug: id });
    }

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    const evaluation = profile
      ? evaluateSchemeEligibility(profile, scheme, documents)
      : null;

    res.json({
      success: true,
      scheme,
      evaluation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST match schemes based on intent/profile
router.post('/match', protect, async (req, res) => {
  try {
    const { intent } = req.body;
    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    const query = { active: true };
    if (intent?.category && intent.category !== 'all') {
      query.category = intent.category;
    }

    const candidateSchemes = await Scheme.find(query);
    const matches = candidateSchemes.map((scheme) => {
      const evaluation = evaluateSchemeEligibility(profile, scheme, documents);
      return {
        scheme,
        ...evaluation,
      };
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
