import mongoose from 'mongoose';

const notificationAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  extractedTitle: {
    type: String,
  },
  department: {
    type: String,
  },
  parsedScheme: {
    schemeName: String,
    targetBeneficiary: String,
    benefitOffered: String,
    eligibilityCriteria: [String],
    requiredDocuments: [String],
    applicationDeadline: String,
    applicationProcess: String,
    officialPortal: String,
  },
  citizenImpact: {
    isRelevant: Boolean,
    relevanceScore: Number,
    relevanceReason: String,
    missingCriteriaOrDocs: [String],
    recommendedActionSteps: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationAnalysis = mongoose.model('NotificationAnalysis', notificationAnalysisSchema);
export default NotificationAnalysis;
