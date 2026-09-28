import Document from '../models/Document.js';
import UserProfile from '../models/UserProfile.js';

/**
 * DigiLocker Vault Simulation Service
 * 
 * Accurately simulates the MeriPehchaan / DigiLocker National Gateway OAuth2
 * and Issuer API pulling flow with clear labeling for demo environments.
 */

export const simulateDigiLockerFetch = async (userId, docType) => {
  // Check if document already exists
  let doc = await Document.findOne({ user: userId, docType });

  const issuerMap = {
    income_certificate: {
      title: 'Income Certificate (आय प्रमाण पत्र)',
      titleHi: 'आय प्रमाण पत्र (सत्र 2024-25)',
      docNumber: `BR-INC-2024-${Math.floor(100000 + Math.random() * 900000)}`,
      issuer: 'Revenue & Land Reforms Dept, Bihar (RTPS Portal)',
      issueDate: '05 May 2024',
      expiryDate: '31 Mar 2027',
      remarks: 'Digital Certificate verified via QR Code • State Repository Valid',
    },
    land_record_khatauni: {
      title: 'Land Record / Khatauni (खतौनी)',
      titleHi: 'भू-अभिलेख / खसरा-खतौनी',
      docNumber: `BR-LR-SAM-Khata-${Math.floor(100 + Math.random() * 900)}`,
      issuer: 'Directorate of Land Records & Survey, Govt of Bihar',
      issueDate: '12 Jan 2024',
      remarks: 'Certified digital copy of RoR (Record of Rights) verified',
    },
    caste_certificate: {
      title: 'Caste Certificate (जाति प्रमाण पत्र)',
      titleHi: 'जाति प्रमाण पत्र (OBC/EBC Non-Creamy Layer)',
      docNumber: `BR-CST-2023-${Math.floor(100000 + Math.random() * 900000)}`,
      issuer: 'Sub-Divisional Officer, Samastipur',
      issueDate: '18 Aug 2023',
      remarks: 'Non-Creamy Layer verified with central OBC list',
    },
  };

  const template = issuerMap[docType] || {
    title: `${docType.replace('_', ' ').toUpperCase()} Certificate`,
    titleHi: docType,
    docNumber: `DL-GOV-${Date.now().toString().slice(-6)}`,
    issuer: 'National DigiLocker Repository (MeitY)',
    issueDate: '10 Jan 2024',
    remarks: 'Verified via DigiLocker Auth API v3.2',
  };

  if (!doc) {
    doc = new Document({
      user: userId,
      docType,
      title: template.title,
      titleHi: template.titleHi,
      docNumber: template.docNumber,
      status: 'verified',
      issuer: template.issuer,
      issueDate: template.issueDate,
      expiryDate: template.expiryDate,
      source: 'digilocker',
      verifiedAt: new Date(),
      remarks: template.remarks,
    });
  } else {
    doc.status = 'verified';
    doc.docNumber = template.docNumber;
    doc.issuer = template.issuer;
    doc.issueDate = template.issueDate;
    doc.expiryDate = template.expiryDate;
    doc.source = 'digilocker';
    doc.verifiedAt = new Date();
    doc.remarks = template.remarks;
  }

  await doc.save();

  // Update profile completion if necessary
  await UserProfile.findOneAndUpdate(
    { user: userId },
    { isDigiLockerSynced: true, updatedAt: new Date() }
  );

  return doc;
};
