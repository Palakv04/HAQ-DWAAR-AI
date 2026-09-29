export const demoUser = {
  id: 'demo-citizen',
  name: 'Pratik Pathak',
  email: 'demo@haqdwaar.gov.in',
  ruralId: '#HD-2401',
  isDemoUser: true,
  role: 'citizen',
};

export const demoProfile = {
  name: 'Pratik Pathak', age: 20, gender: 'Male', state: 'Madhya Pradesh', district: 'Jabalpur',
  blockPanchayat: 'Jabalpur', education: '12th_pass', marks12thPercentage: 78.4,
  occupation: 'student', casteCategory: 'OBC', annualIncome: 160000, incomeRange: '1 - 2.5 Lakhs',
  activeMode: 'Student', profileCompletion: 85,
  personalDetails: {
    fullName: 'Pratik Pathak', age: 20, gender: 'Male', state: 'Madhya Pradesh', district: 'Jabalpur',
    panchayatBlock: 'Jabalpur', aadhaarNumber: 'XXXX XXXX 2401', mobileNumber: 'XXXXXX2401', email: 'demo@haqdwaar.gov.in'
  },
  educationDetails: {
    highestEducationLevel: '12th Pass', marks12thPercentage: 78.4, socialCategory: 'OBC',
    primaryOccupation: 'Student (विद्यार्थी)', annualHouseholdIncome: 160000,
    incomeBracket: 'less than 1 lakh', casteCategory: 'General', casteCertificateNumber: 'MP-gen-2401',
  },
  studentDetails: { institution: 'Shri Ram Institute of Technology', course: 'B.Tech Computer Science', currentYear: 4, annualTuitionFees: 70000 },
  higherEducationDetails: {
    enrolledCollegeUniversity: 'Shri Ram Institute of Technology', degreeCourseName: 'B.Tech Computer Science',
    annualTuitionFees: 85000, currentAcademicYear: 1,
  },
  familyDetails: { membersCount: 5, rationCardNumber: 'BR-SAM-9012' },
};

export const demoDocuments = [
  { _id: 'demo-aadhaar', docType: 'aadhaar', title: 'Aadhaar Card', titleHi: 'आधार कार्ड', issuer: 'UIDAI', status: 'verified', docNumber: 'XXXX XXXX 2401' },
  { _id: 'demo-marksheet', docType: 'marksheet_12th', title: '12th Board Marksheet', titleHi: '12वीं बोर्ड मार्कशीट', issuer: 'BSEB', status: 'verified', docNumber: 'BSEB-78-2401' },
  { _id: 'demo-income', docType: 'income_certificate', title: 'Income Certificate', titleHi: 'आय प्रमाण पत्र', issuer: 'RTPS Bihar', status: 'action_needed' },
  { _id: 'demo-bank', docType: 'bank_passbook', title: 'Aadhaar Linked Bank Account', titleHi: 'आधार सीडेड बैंक खाता', issuer: 'SBI', status: 'verified', docNumber: 'XXXX2401' },
];

export const demoReadiness = { overallScore: 82, eligibilityScore: 100, documentScore: 80, informationScore: 90, verificationScore: 60 };

export const demoSchemes = [
  {
    _id: 'demo-medhavi', name: 'Mukhyamantri Medhavi Vidyarthi Yojana', nameHi: 'मुख्यमंत्री मेधावी विद्यार्थी योजना',
    shortDescription: 'Tuition support for meritorious Bihar students pursuing engineering and undergraduate study.',
    shortDescriptionHi: 'बिहार के मेधावी विद्यार्थियों को इंजीनियरिंग और स्नातक पढ़ाई की फीस में सहायता.',
    level: 'State', state: 'Bihar', category: 'education', categoryLabel: 'Education & Scholarships',
    benefit: 'Up to ₹1,50,000 tuition reimbursement per academic year', benefitAmount: 150000,
    benefitType: 'Reimbursement to College / DBT', officialUrl: 'https://medhavividyarthi.bihar.gov.in', deadline: '31 October 2026',
    matchPercentage: 94, docReadinessScore: 80, compositeReadiness: 82,
    matchedCriteria: [{ detail: 'Bihar domicile verified' }, { detail: '12th marks: 78.4%' }, { detail: 'Income appears below limit' }],
    missingDocuments: [{ docType: 'income_certificate', title: 'Income Certificate' }],
    whyMatchedSummary: 'Student in Bihar with 78.4% marks and income below the scheme limit.',
    requiredDocuments: [
      { docType: 'aadhaar', title: 'Aadhaar Card' }, { docType: 'marksheet_12th', title: '12th Board Certificate' },
      { docType: 'income_certificate', title: 'Income Certificate (Current Year)' }, { docType: 'bank_passbook', title: 'Aadhaar Linked Bank Passbook' },
    ],
  },
  {
    _id: 'demo-credit-card', name: 'Bihar Student Credit Card Scheme', nameHi: 'बिहार स्टूडेंट क्रेडिट कार्ड योजना',
    shortDescription: 'State-guaranteed education loan for higher studies.', shortDescriptionHi: 'उच्च शिक्षा के लिए राज्य गारंटी वाला शिक्षा ऋण.',
    level: 'State', state: 'Bihar', category: 'education', categoryLabel: 'Education & Scholarships',
    benefit: 'Education loan up to ₹4,00,000', benefitAmount: 400000, benefitType: 'Concessional Education Credit',
    officialUrl: 'https://www.7nishchay-yuvaupmission.bihar.gov.in', deadline: 'Open for 2026 batches', matchPercentage: 88,
    matchedCriteria: [{ detail: 'Bihar student' }, { detail: '12th pass' }], missingDocuments: [],
  },
];

export const demoApplicationKey = 'haqdwaar_demo_application';