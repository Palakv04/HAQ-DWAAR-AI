import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import UserProfile from './models/UserProfile.js';
import Scheme from './models/Scheme.js';
import Document from './models/Document.js';
import Application from './models/Application.js';
import { defaultSchemes } from './data/schemesData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/haqdwaar';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Schemes
    console.log('[Seed] Seeding Schemes...');
    await Scheme.deleteMany({});
    const insertedSchemes = await Scheme.insertMany(defaultSchemes);
    console.log(`[Seed] Successfully inserted ${insertedSchemes.length} schemes`);

    // 2. Seed Default Demo User
    console.log('[Seed] Seeding default demo citizen user...');
    await User.deleteMany({ email: 'demo@haqdwaar.gov.in' });
    const demoUser = await User.create({
      name: 'Demo Citizen',
      email: 'demo@haqdwaar.gov.in',
      phone: '9876543210',
      password: 'Password@123',
      ruralId: '#0001',
      isDemoUser: true,
      role: 'citizen',
      preferredLanguage: 'hi',
    });

    // 3. Seed UserProfile
    console.log('[Seed] Seeding citizen Benefit Passport profile...');
    await UserProfile.deleteMany({ user: demoUser._id });
    const profile = await UserProfile.create({
      user: demoUser._id,
      name: 'Demo Citizen',
      age: 20,
      gender: 'Male',
      state: 'Bihar',
      district: 'Samastipur',
      blockPanchayat: 'Kalyanpur Gram Panchayat, Kalyanpur',
      education: '12th_pass',
      marks12thPercentage: 78.4,
      occupation: 'student',
      casteCategory: 'OBC',
      incomeRange: '1 - 2.5 Lakhs',
      annualIncome: 160000,
      isBPL: true,
      isAadhaarLinked: true,
      isDigiLockerSynced: true,
      activeMode: 'Student',
      profileCompletion: 85,
      studentDetails: {
        institution: 'Samastipur College (LNMU Darbhanga)',
        course: 'B.Tech / Professional Degree',
        currentYear: 1,
        annualTuitionFees: 85000,
      },
      farmerDetails: {
        isFarmerFamily: true,
        landHoldingAcres: 1.5,
        landOwnership: 'owned',
        hasKisanCreditCard: false,
        crops: ['Wheat', 'Maize', 'Paddy'],
      },
      familyDetails: {
        membersCount: 5,
        rationCardNumber: 'BR-SAM-9012',
        rationCardType: 'PHH (Kalyan Patra)',
      },
    });

    // 4. Seed Documents (4 Verified, 2 Action Pending)
    console.log('[Seed] Seeding citizen documents (DigiLocker vault)...');
    await Document.deleteMany({ user: demoUser._id });
    const docs = [
      {
        user: demoUser._id,
        docType: 'aadhaar',
        title: 'Aadhaar Card (e-Pramaan)',
        titleHi: 'आधार कार्ड (e-प्रमाण)',
        docNumber: 'XXXX-XXXX-9012',
        status: 'verified',
        issuer: 'UIDAI Govt of India',
        issueDate: '14 Feb 2018',
        source: 'digilocker',
        verifiedAt: new Date('2024-01-10'),
        remarks: 'Biometrics & Demographic data verified with UIDAI',
      },
      {
        user: demoUser._id,
        docType: 'ration_card',
        title: 'Ration Card (NFSA state civil list)',
        titleHi: 'राशन कार्ड (NFSA राज्य नागरिक सूची)',
        docNumber: 'BR-SAM-9012',
        status: 'verified',
        issuer: 'NFSA / Food & Civil Supplies Dept',
        issueDate: '01 Jan 2021',
        source: 'digilocker',
        verifiedAt: new Date('2024-02-15'),
        remarks: 'PHH Category • Kalyanpur Block',
      },
      {
        user: demoUser._id,
        docType: 'marksheet_12th',
        title: '10th / 12th Board Certificate',
        titleHi: '10वीं / 12वीं बोर्ड प्रमाण पत्र',
        docNumber: 'BSEB-2023-7841',
        status: 'verified',
        issuer: 'BSEB Patna - 2023 Passout',
        issueDate: '24 May 2023',
        source: 'digilocker',
        verifiedAt: new Date('2024-03-01'),
        remarks: 'Merit: 78.4% (First Division with Distinction)',
      },
      {
        user: demoUser._id,
        docType: 'bank_passbook',
        title: 'Aadhaar Seeded Bank Account',
        titleHi: 'आधार सीडेड जनधन बैंक खाता',
        docNumber: 'SBI-****4301',
        status: 'verified',
        issuer: 'State Bank of India, Kalyanpur Branch',
        issueDate: '10 Nov 2019',
        source: 'digilocker',
        verifiedAt: new Date('2024-03-12'),
        remarks: 'NPCI Mapping Active • DBT Enabled',
      },
      {
        user: demoUser._id,
        docType: 'income_certificate',
        title: 'Income Certificate (आय प्रमाण पत्र)',
        titleHi: 'आय प्रमाण पत्र (सत्र 2024-25)',
        docNumber: 'BR-INC-2022-8819',
        status: 'action_needed',
        issuer: 'Revenue Dept, Bihar',
        issueDate: '15 Sep 2022',
        expiryDate: '15 Sep 2023',
        source: 'digilocker',
        remarks: 'Expired (Issued 2022). Validity requires after 1st April 2024 for affirmative grants.',
      },
      {
        user: demoUser._id,
        docType: 'land_record_khatauni',
        title: 'Land Record / Khatauni (खतौनी)',
        titleHi: 'भू-अभिलेख / खसरा-खतौनी',
        docNumber: 'Kalyanpur-Khata-204',
        status: 'action_needed',
        issuer: 'Revenue & Land Reforms Dept, Bihar',
        source: 'unlinked',
        remarks: 'Action Pending: Auto-fetch via State Land Registry or upload Patta copy.',
      },
    ];
    await Document.insertMany(docs);

    // 5. Seed 1 Active Application
    console.log('[Seed] Seeding active application...');
    await Application.deleteMany({ user: demoUser._id });
    const mmvyScheme = insertedSchemes.find(s => s.slug === 'mukhyamantri-medhavi-vidyarthi-yojana');
    if (mmvyScheme) {
      await Application.create({
        user: demoUser._id,
        scheme: mmvyScheme._id,
        schemeName: mmvyScheme.name,
        category: 'education',
        trackingNumber: 'HQD-MMVY-2024-8841',
        status: 'Documents Pending',
        currentStep: 2,
        benefitAmount: 150000,
        officialPortalUrl: mmvyScheme.officialUrl,
        steps: [
          {
            stepNumber: 1,
            title: 'Benefit Passport Verification',
            titleHi: 'लाभार्थी प्रोफाइल सत्यापन',
            status: 'completed',
            notes: 'Citizen verified via Aadhaar & 12th marksheet',
          },
          {
            stepNumber: 2,
            title: 'Income Certificate Clearance',
            titleHi: 'आय प्रमाण पत्र प्रमाणीकरण',
            status: 'in_progress',
            notes: 'Income certificate expired. Fetch latest via DigiLocker to auto-unlock.',
          },
          {
            stepNumber: 3,
            title: 'Institutional Admission Endorsement',
            titleHi: 'संस्थान नामांकन सत्यापन',
            status: 'pending',
            notes: 'Pending fee receipt upload from Samastipur College',
          },
          {
            stepNumber: 4,
            title: 'District Welfare Sanction',
            titleHi: 'जिला कल्याण अनुमोदन',
            status: 'pending',
            notes: 'Awaiting digital signing by Welfare Officer',
          },
          {
            stepNumber: 5,
            title: 'Direct Benefit Transfer (DBT)',
            titleHi: 'डीबीटी छात्रवृत्ति भुगतान',
            status: 'pending',
            notes: 'Final tuition credit to student bank account',
          },
        ],
        actionChecklist: [
          { task: 'Verify 12th Marks (78.4% achieved)', isDone: true },
          { task: 'Link Aadhaar-seeded Bank Account', isDone: true },
          { task: 'Fetch valid Income Certificate (< ₹6 Lakhs)', isDone: false },
          { task: 'Submit application on State Medhavi Portal', isDone: false },
        ],
      });
    }

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
