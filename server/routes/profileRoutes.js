import express from 'express';
import UserProfile from '../models/UserProfile.js';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
import { calculateOverallCitizenReadiness } from '../services/eligibilityEngine.js';

const router = express.Router();

// GET citizen Benefit Passport
router.get('/', protect, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await UserProfile.create({
        user: req.user._id,
        name: req.user.name,
        state: 'Bihar',
        district: 'Samastipur',
      });
    }

    const documents = await Document.find({ user: req.user._id });
    const readiness = calculateOverallCitizenReadiness(profile, documents);

    res.json({
      success: true,
      profile,
      readiness,
      documentsCount: documents.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update Benefit Passport
router.put('/', protect, async (req, res) => {
  try {
    const updates = req.body;
    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new UserProfile({ user: req.user._id, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    // Calculate completion %
    let filledFields = 0;
    const trackedKeys = ['name', 'age', 'gender', 'state', 'district', 'education', 'occupation', 'incomeRange', 'annualIncome', 'casteCategory'];
    trackedKeys.forEach((k) => {
      if (profile[k] !== undefined && profile[k] !== null && profile[k] !== '') {
        filledFields++;
      }
    });

    profile.profileCompletion = Math.round((filledFields / trackedKeys.length) * 100);
    await profile.save();

    const documents = await Document.find({ user: req.user._id });
    const readiness = calculateOverallCitizenReadiness(profile, documents);

    res.json({
      success: true,
      message: 'Benefit Passport updated successfully',
      profile,
      readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH change active mode (Student, Kisan, Rozgar, Business, Citizen)
router.patch('/mode', protect, async (req, res) => {
  try {
    const { mode } = req.body;
    if (!['Student', 'Kisan', 'Rozgar', 'Business', 'Citizen'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Invalid mode' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { activeMode: mode },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      activeMode: profile.activeMode,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
