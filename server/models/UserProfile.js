import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 20,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  state: {
    type: String,
    default: 'Bihar',
  },
  district: {
    type: String,
    default: 'Samastipur',
  },
  blockPanchayat: {
    type: String,
    default: 'Kalyanpur Gram Panchayat',
  },
  education: {
    type: String,
    default: '12th_pass',
  },
  marks12thPercentage: {
    type: Number,
    default: 78.4,
  },
  occupation: {
    type: String,
    enum: ['student', 'farmer', 'artisan', 'self_employed', 'daily_wage', 'unemployed', 'salaried'],
    default: 'student',
  },
  casteCategory: {
    type: String,
    enum: ['General', 'OBC', 'EBC', 'SC', 'ST', 'EWS'],
    default: 'OBC',
  },
  incomeRange: {
    type: String,
    default: '1 - 2.5 Lakhs',
  },
  annualIncome: {
    type: Number,
    default: 160000,
  },
  isBPL: {
    type: Boolean,
    default: true,
  },
  isAadhaarLinked: {
    type: Boolean,
    default: true,
  },
  isDigiLockerSynced: {
    type: Boolean,
    default: true,
  },
  studentDetails: {
    institution: { type: String, default: 'Samastipur College' },
    course: { type: String, default: 'B.Tech Computer Science' },
    currentYear: { type: Number, default: 1 },
    annualTuitionFees: { type: Number, default: 85000 },
  },
  farmerDetails: {
    isFarmerFamily: { type: Boolean, default: true },
    landHoldingAcres: { type: Number, default: 1.5 },
    landOwnership: { type: String, default: 'owned' },
    hasKisanCreditCard: { type: Boolean, default: false },
    crops: { type: [String], default: ['Wheat', 'Maize', 'Paddy'] },
  },
  familyDetails: {
    membersCount: { type: Number, default: 5 },
    rationCardNumber: { type: String, default: 'BR-SAM-9012' },
    rationCardType: { type: String, default: 'PHH (Kalyan Patra)' },
  },
  activeMode: {
    type: String,
    enum: ['Student', 'Kisan', 'Rozgar', 'Business', 'Citizen'],
    default: 'Student',
  },
  profileCompletion: {
    type: Number,
    default: 85,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
