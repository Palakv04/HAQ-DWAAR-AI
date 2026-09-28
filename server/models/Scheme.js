import mongoose from 'mongoose';

const eligibilityRulesSchema = new mongoose.Schema({
  minAge: { type: Number, default: 0 },
  maxAge: { type: Number, default: 120 },
  states: { type: [String], default: ['All'] },
  allowedGenders: { type: [String], default: ['Male', 'Female', 'Other'] },
  allowedOccupations: { type: [String], default: [] },
  allowedEducation: { type: [String], default: [] },
  minMarksPercentage: { type: Number, default: 0 },
  maxAnnualIncome: { type: Number, default: 10000000 },
  allowedCastes: { type: [String], default: ['General', 'OBC', 'EBC', 'SC', 'ST', 'EWS'] },
  maxLandHoldingAcres: { type: Number, default: 999 },
  requiresLandOwnership: { type: Boolean, default: false },
  requiresBPL: { type: Boolean, default: false },
});

const requiredDocumentSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleHi: {
    type: String,
  },
  mandatory: {
    type: Boolean,
    default: true,
  },
});

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameHi: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  shortDescriptionHi: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  departmentHi: {
    type: String,
  },
  level: {
    type: String,
    enum: ['Central', 'State'],
    default: 'Central',
  },
  state: {
    type: String,
    default: 'All',
  },
  category: {
    type: String,
    enum: ['education', 'agriculture', 'employment', 'health', 'social_security'],
    required: true,
  },
  categoryLabel: {
    type: String,
  },
  categoryLabelHi: {
    type: String,
  },
  benefit: {
    type: String,
    required: true,
  },
  benefitHi: {
    type: String,
  },
  benefitAmount: {
    type: Number,
    default: 0,
  },
  benefitType: {
    type: String,
    default: 'Direct Benefit Transfer (DBT)',
  },
  officialUrl: {
    type: String,
    required: true,
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  lastVerifiedAt: {
    type: Date,
    default: Date.now,
  },
  eligibilityRules: {
    type: eligibilityRulesSchema,
    default: () => ({}),
  },
  requiredDocuments: [requiredDocumentSchema],
  deadline: {
    type: String,
    default: 'Open Round the Year',
  },
  active: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
