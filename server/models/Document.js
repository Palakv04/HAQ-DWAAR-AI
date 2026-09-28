import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  docType: {
    type: String,
    enum: [
      'aadhaar',
      'ration_card',
      'marksheet_12th',
      'income_certificate',
      'caste_certificate',
      'land_record_khatauni',
      'bank_passbook',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleHi: {
    type: String,
  },
  docNumber: {
    type: String,
  },
  status: {
    type: String,
    enum: ['verified', 'action_needed', 'missing', 'expired'],
    default: 'missing',
  },
  issuer: {
    type: String,
    default: 'Govt of India',
  },
  issueDate: {
    type: String,
  },
  expiryDate: {
    type: String,
  },
  source: {
    type: String,
    enum: ['digilocker', 'manual_upload', 'unlinked'],
    default: 'digilocker',
  },
  verifiedAt: {
    type: Date,
  },
  remarks: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
