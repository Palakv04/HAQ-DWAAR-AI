import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  ruralId: {
    type: String,
    default: () => `#${Math.floor(1000 + Math.random() * 9000)}`,
  },
  isDemoUser: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['citizen', 'vle_agent', 'admin'],
    default: 'citizen',
  },
  preferredLanguage: {
    type: String,
    enum: ['hi', 'en', 'bho', 'mai'],
    default: 'hi',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
