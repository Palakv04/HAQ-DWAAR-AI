import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// Register new citizen
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, state, district, occupation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Citizen with this email already registered' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      ruralId: `#${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'citizen',
    });

    // Create initial profile
    await UserProfile.create({
      user: user._id,
      name: user.name,
      state: state || 'Bihar',
      district: district || 'Samastipur',
      occupation: occupation || 'student',
      activeMode: occupation === 'farmer' ? 'Kisan' : 'Student',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        ruralId: user.ruralId,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          ruralId: user.ruralId,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or mobile/email' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Instant Demo Login (Generic Demo Citizen)
router.post('/demo-login', async (req, res) => {
  try {
    let demoUser = await User.findOne({ email: 'demo@haqdwaar.gov.in' });
    if (!demoUser) {
      return res.status(404).json({ success: false, message: 'Demo citizen not found. Please run seed.' });
    }
    res.json({
      success: true,
      token: generateToken(demoUser._id),
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        ruralId: demoUser.ruralId,
        isDemoUser: true,
        role: demoUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Current User Me
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        ruralId: req.user.ruralId,
        isDemoUser: req.user.isDemoUser,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
