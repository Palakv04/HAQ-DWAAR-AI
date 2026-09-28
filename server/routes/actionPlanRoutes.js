import express from 'express';
import Scheme from '../models/Scheme.js';
import UserProfile from '../models/UserProfile.js';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
import { evaluateSchemeEligibility } from '../services/eligibilityEngine.js';
import { generateActionPlan } from '../services/aiService.js';

const router = express.Router();

router.post('/:schemeId', protect, async (req, res) => {
  try {
    const { schemeId } = req.params;
    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    const profile = await UserProfile.findOne({ user: req.user._id });
    const documents = await Document.find({ user: req.user._id });

    const evaluation = evaluateSchemeEligibility(profile, scheme, documents);
    const actionPlanSteps = generateActionPlan(scheme, profile, evaluation.missingDocuments);

    res.json({
      success: true,
      scheme: {
        id: scheme._id,
        name: scheme.name,
        nameHi: scheme.nameHi,
        officialUrl: scheme.officialUrl,
        benefit: scheme.benefit,
        department: scheme.department,
      },
      evaluation,
      actionPlan: actionPlanSteps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
