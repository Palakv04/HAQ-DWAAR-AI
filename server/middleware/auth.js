import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'haqdwaar_super_secure_jwt_secret_2026';

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }
    }

    // Demo Mode fallback: if no token or invalid, use default demo user Pratik Kumar
    const demoUser = await User.findOne({ email: 'pratik@haqdwaar.gov.in' });
    if (demoUser) {
      req.user = demoUser;
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized, no user session available' });
  } catch (error) {
    // If token expired, fall back to demo user gracefully
    const demoUser = await User.findOne({ email: 'pratik@haqdwaar.gov.in' });
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
  }
};
