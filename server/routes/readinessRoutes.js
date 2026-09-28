import express from 'express';
import UserProfile from '../models/UserProfile.js';
import Document from '../models/Document.js';
import Scheme from '../models/Scheme.js';
import { protect } from '../middleware/auth.js';
import { calculateOverallCitizenReadiness, evaluateSchemeEligibility } from '../services/eligibilityEngine.js';

const router = express.Router();

// GET overall citizen readiness
router.get('/', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const readiness = calculateOverallCitizenReadiness(profile, documents);
    res.json({
      success: true,
      readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET readiness for specific scheme
router.get('/:schemeId', protect, async (req, res) => {
  try {
    const { schemeId } = req.params;
    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });
    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    const evaluation = evaluateSchemeEligibility(profile, scheme, documents);
    res.json({
      success: true,
      schemeId,
      evaluation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
