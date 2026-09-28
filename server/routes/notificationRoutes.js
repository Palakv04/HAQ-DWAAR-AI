import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import UserProfile from '../models/UserProfile.js';
import NotificationAnalysis from '../models/NotificationAnalysis.js';
import { protect } from '../middleware/auth.js';
import { analyzeNotificationText } from '../services/pdfService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Pre-configured official government circular samples for instant 1-click test
const sampleCirculars = [
  {
    id: 'sample-bihar-medhavi',
    title: 'Bihar Medhavi Vidyarthi Yojana 2024 Gazette Notification',
    department: 'Department of Higher Education, Govt of Bihar',
    text: `GOVERNMENT OF BIHAR - DEPARTMENT OF EDUCATION
NOTIFICATION NO: ED-HE/2024/0912 - PATNA
SUBJECT: EXPANSION OF MUKHYAMANTRI MEDHAVI VIDYARTHI YOJANA FOR ACADEMIC YEAR 2024-25

1. Short Title and Commencement:
This scheme shall be called the Mukhyamantri Medhavi Vidyarthi Protsahan Yojana (Amended 2024). It shall apply to all accredited engineering, medical, law, and degree colleges across Bihar.

2. Beneficiary Eligibility:
(a) The candidate must be a permanent domicile resident of Bihar state.
(b) The candidate must have secured a minimum of 70% marks in the Class 12 Higher Secondary Examinations conducted by BSEB/CBSE/ICSE.
(c) The cumulative annual income of the candidate's family from all sources must not exceed ₹6,00,000 (Rupees Six Lakhs only).

3. Extent of Financial Benefit:
State affirmative subsidy shall cover 100% of approved university tuition and hostel fee reimbursement up to ₹1,50,000 per academic year directly disbursed via DBT to the institution or Aadhaar-seeded student bank account.

4. Mandatory Documents:
Candidates must produce Aadhaar Card, 12th Board marksheet, valid Income Certificate issued on or after 1st April 2024 by Circle Officer / SDO via RTPS, and proof of college enrollment.

5. Application Procedure & Deadline:
Applications shall be submitted on the official state portal at https://medhavividyarthi.bihar.gov.in. Final date for institutional verification for current session is 31 October 2026.`,
  },
  {
    id: 'sample-pmkisan-17th',
    title: 'PM-Kisan 17th Installment Release Gazette Order',
    department: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    text: `MINISTRY OF AGRICULTURE AND FARMERS WELFARE
KRISHI BHAWAN, NEW DELHI - CIRCULAR NO: AG-11024/2024

SUBJECT: RELEASE OF 17TH TRANCHE OF FINANCIAL BENEFIT UNDER PRADHAN MANTRI KISAN SAMMAN NIDHI (PM-KISAN)

1. General Statutory Order:
The Competent Authority has sanctioned the disbursement of the 17th four-monthly installment under PM-KISAN for the period April - July 2024.

2. Quantum of Assistance:
Eligible landholding farmer families will receive direct cash credit of ₹2,000 directly into their bank accounts mapped on the NPCI Aadhaar Payments Bridge (APB).

3. Compulsory Eligibility Criteria:
(a) The beneficiary must be a recognized small or marginal farmer owning cultivable agricultural land.
(b) Land records (Khatauni / Khasra) must be digitally verified by the State Land Revenue Authority.
(c) Aadhaar-based biometric e-KYC or Face-Authentication is strictly mandatory. Institutional landholders and income tax payees are excluded.

4. Redressal & Official Portal:
Farmers can check beneficiary status and update Aadhaar linking at https://pmkisan.gov.in or through Common Service Centers (CSC).`,
  },
];

// GET sample circulars for demo testing
router.get('/samples', protect, (req, res) => {
  res.json({
    success: true,
    samples: sampleCirculars,
  });
});

// POST analyze notification (from text or uploaded PDF)
router.post('/analyze', protect, upload.single('pdfFile'), async (req, res) => {
  try {
    let rawText = '';
    let fileName = 'Direct_Pasted_Notification.txt';

    if (req.file) {
      fileName = req.file.originalname;
      const pdfData = await pdfParse(req.file.buffer);
      rawText = pdfData.text;
    } else if (req.body.text) {
      rawText = req.body.text;
      fileName = req.body.title || 'Official_Circular.txt';
    } else if (req.body.sampleId) {
      const sample = sampleCirculars.find((s) => s.id === req.body.sampleId);
      if (sample) {
        rawText = sample.text;
        fileName = sample.title;
      }
    }

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide PDF document or circular text' });
    }

    const profile = await UserProfile.findOne({ user: req.user._id });
    const analysisResult = await analyzeNotificationText(rawText, profile, fileName);

    // Save record to DB
    const savedRecord = await NotificationAnalysis.create({
      user: req.user._id,
      fileName,
      extractedTitle: analysisResult.parsedScheme?.schemeName || fileName,
      department: analysisResult.parsedScheme?.department || 'Government Department',
      parsedScheme: analysisResult.parsedScheme,
      citizenImpact: analysisResult.citizenImpact,
    });

    res.json({
      success: true,
      data: savedRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
