import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true,
  },
  schemeName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'education',
  },
  trackingNumber: {
    type: String,
    default: () => `HQD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
  },
  status: {
    type: String,
    enum: ['Draft', 'Documents Pending', 'Under Review', 'Applied', 'Approved', 'Sanctioned'],
    default: 'Documents Pending',
  },
  currentStep: {
    type: Number,
    default: 2,
  },
  steps: [
    {
      stepNumber: Number,
      title: String,
      titleHi: String,
      status: {
        type: String,
        enum: ['completed', 'in_progress', 'pending'],
        default: 'pending',
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      notes: String,
    },
  ],
  benefitAmount: {
    type: Number,
    default: 0,
  },
  officialPortalUrl: {
    type: String,
  },
  actionChecklist: [
    {
      task: String,
      isDone: { type: Boolean, default: false },
    },
  ],
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
