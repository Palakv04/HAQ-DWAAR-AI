import express from 'express';
import Document from '../models/Document.js';
import UserProfile from '../models/UserProfile.js';
import { protect } from '../middleware/auth.js';
import { simulateDigiLockerFetch } from '../services/digilockerService.js';
import { calculateOverallCitizenReadiness } from '../services/eligibilityEngine.js';

const router = express.Router();

// GET all citizen documents
router.get('/', protect, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const profile = await UserProfile.findOne({ user: req.user._id });
    const readiness = profile ? calculateOverallCitizenReadiness(profile, documents) : null;

    res.json({
      success: true,
      documents,
      readiness,
      stats: {
        total: documents.length,
        verified: documents.filter((d) => d.status === 'verified').length,
        actionNeeded: documents.filter((d) => d.status === 'action_needed' || d.status === 'expired').length,
        missing: documents.filter((d) => d.status === 'missing').length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST simulate 1-click DigiLocker fetch
router.post('/digilocker/fetch', protect, async (req, res) => {
  try {
    const { docType } = req.body;
    if (!docType) {
      return res.status(400).json({ success: false, message: 'docType is required' });
    }

    const updatedDoc = await simulateDigiLockerFetch(req.user._id, docType);
    const documents = await Document.find({ user: req.user._id });
    const profile = await UserProfile.findOne({ user: req.user._id });
    const readiness = calculateOverallCitizenReadiness(profile, documents);

    res.json({
      success: true,
      message: `${updatedDoc.title} fetched and verified from DigiLocker repository!`,
      document: updatedDoc,
      readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST sync all pending DigiLocker documents
router.post('/digilocker/sync-all', protect, async (req, res) => {
  try {
    const pendingDocs = await Document.find({
      user: req.user._id,
      status: { $in: ['action_needed', 'expired', 'missing'] },
    });

    const syncedResults = [];
    for (const doc of pendingDocs) {
      const resDoc = await simulateDigiLockerFetch(req.user._id, doc.docType);
      syncedResults.push(resDoc);
    }

    const allDocuments = await Document.find({ user: req.user._id });
    const profile = await UserProfile.findOne({ user: req.user._id });
    const readiness = calculateOverallCitizenReadiness(profile, allDocuments);

    res.json({
      success: true,
      message: `Successfully synchronized ${syncedResults.length} pending certificates with DigiLocker National Gateway!`,
      syncedCount: syncedResults.length,
      documents: allDocuments,
      readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST manual document add or upload
router.post('/upload', protect, async (req, res) => {
  try {
    const { docType, title, titleHi, docNumber, issuer } = req.body;

    let doc = await Document.findOne({ user: req.user._id, docType });
    if (!doc) {
      doc = new Document({
        user: req.user._id,
        docType: docType || 'marksheet_12th',
        title: title || 'Educational Certificate',
        titleHi: titleHi || 'शैक्षिक प्रमाण पत्र',
        docNumber: docNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'verified',
        issuer: issuer || 'Authorized Board / University',
        source: 'manual_upload',
        verifiedAt: new Date(),
        remarks: 'Uploaded by citizen & verified via OCR digital seal',
      });
    } else {
      doc.status = 'verified';
      doc.docNumber = docNumber || doc.docNumber;
      doc.issuer = issuer || doc.issuer;
      doc.source = 'manual_upload';
      doc.verifiedAt = new Date();
      doc.remarks = 'Updated via citizen manual upload with digital seal';
    }

    await doc.save();
    const documents = await Document.find({ user: req.user._id });
    const profile = await UserProfile.findOne({ user: req.user._id });
    const readiness = calculateOverallCitizenReadiness(profile, documents);

    res.json({
      success: true,
      message: 'Document uploaded and verified successfully',
      document: doc,
      readiness,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
