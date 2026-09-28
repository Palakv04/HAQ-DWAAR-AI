import mongoose from 'mongoose';

const claimVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  claimText: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: ['VERIFIED', 'PARTIALLY VERIFIED', 'COULD NOT VERIFY', 'POTENTIALLY MISLEADING'],
    required: true,
  },
  confidenceScore: {
    type: Number,
    default: 85,
  },
  matchedSchemeName: {
    type: String,
  },
  matchedSchemeUrl: {
    type: String,
  },
  analysis: {
    headline: String,
    headlineHi: String,
    truthSummary: String,
    truthSummaryHi: String,
    falseClaims: [String],
    verifiedFacts: [String],
    advisory: String,
    officialFactCheckUrl: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClaimVerification = mongoose.model('ClaimVerification', claimVerificationSchema);
export default ClaimVerification;
