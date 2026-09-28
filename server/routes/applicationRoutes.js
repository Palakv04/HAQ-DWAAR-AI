import express from 'express';
import Application from '../models/Application.js';
import Scheme from '../models/Scheme.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all applications for current user
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('scheme')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST save / start new application for a scheme
router.post('/', protect, async (req, res) => {
  try {
    const { schemeId, notes } = req.body;
    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    // Check if application already exists
    let app = await Application.findOne({ user: req.user._id, scheme: schemeId });
    if (app) {
      return res.json({
        success: true,
        message: 'Application already active in tracking dashboard',
        application: app,
      });
    }

    app = await Application.create({
      user: req.user._id,
      scheme: scheme._id,
      schemeName: scheme.name,
      category: scheme.category,
      benefitAmount: scheme.benefitAmount,
      officialPortalUrl: scheme.officialUrl,
      status: 'Documents Pending',
      currentStep: 2,
      steps: [
        {
          stepNumber: 1,
          title: 'Citizen Passport Verification',
          titleHi: 'नागरिक प्रोफाइल सत्यापन',
          status: 'completed',
          notes: 'Aadhaar demographic data matched with state database',
        },
        {
          stepNumber: 2,
          title: 'Document Clearance in DigiLocker',
          titleHi: 'दस्तावेज़ पूर्णता जांच',
          status: 'in_progress',
          notes: 'Certificates verified via DigiLocker National Gateway',
        },
        {
          stepNumber: 3,
          title: 'Institutional / Department Endorsement',
          titleHi: 'संस्थान / ब्लॉक सत्यापन',
          status: 'pending',
          notes: 'Department level verification and scrutiny',
        },
        {
          stepNumber: 4,
          title: 'Welfare Sanction Order',
          titleHi: 'कल्याणकारी स्वीकृति आदेश',
          status: 'pending',
          notes: 'Official sanction order issuance',
        },
        {
          stepNumber: 5,
          title: 'Direct Benefit Transfer (DBT)',
          titleHi: 'डीबीटी बैंक अंतरण',
          status: 'pending',
          notes: 'Direct Aadhaar-seeded account credit',
        },
      ],
      actionChecklist: scheme.requiredDocuments.map((doc) => ({
        task: `Verify ${doc.title}`,
        isDone: false,
      })),
      notes: notes || 'Enrolled via HaqDwaar Citizen Portal',
    });

    res.status(201).json({
      success: true,
      message: 'Application initiated successfully',
      application: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH advance or update application status
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, currentStep, stepNotes, checklistUpdates } = req.body;
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status) {
      app.status = status;
    }
    if (currentStep !== undefined) {
      app.currentStep = currentStep;
      // Update step status accordingly
      app.steps.forEach((st) => {
        if (st.stepNumber < currentStep) {
          st.status = 'completed';
        } else if (st.stepNumber === currentStep) {
          st.status = 'in_progress';
          if (stepNotes) st.notes = stepNotes;
        } else {
          st.status = 'pending';
        }
      });
    }

    if (checklistUpdates && Array.isArray(checklistUpdates)) {
      app.actionChecklist = checklistUpdates;
    }

    await app.save();

    res.json({
      success: true,
      message: 'Application progress updated successfully',
      application: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE remove application
router.delete('/:id', protect, async (req, res) => {
  try {
    await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Application removed from tracker' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
