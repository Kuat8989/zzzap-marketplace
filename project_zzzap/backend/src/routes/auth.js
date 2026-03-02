/**
 * Auth Routes - Mobile Optimized
 * POST /auth/login - Login via Phone/SMS
 * POST /auth/verify - Verify OTP code
 * POST /auth/logout - Logout user
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user storage (replace with DB)
const pendingVerifications = new Map();

/**
 * POST /auth/login
 * Send OTP to phone number
 */
router.post('/login', async (req, res) => {
  try {
    const { phone_number } = req.body;
    
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    // Validate phone format (Kazakhstan +7)
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Invalid phone format. Use +7XXXXXXXXXX' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (5 minutes)
    pendingVerifications.set(phone_number, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });
    
    // TODO: Send SMS via Twilio/Firebase
    console.log(`📱 OTP for ${phone_number}: ${otp} (DEV MODE)`);
    
    res.json({
      success: true,
      message: 'OTP sent',
      phone_number,
      expires_in: 300 // 5 minutes in seconds
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * POST /auth/verify
 * Verify OTP and return JWT token
 */
router.post('/verify', async (req, res) => {
  try {
    const { phone_number, otp } = req.body;
    
    if (!phone_number || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP required' });
    }
    
    const verification = pendingVerifications.get(phone_number);
    
    if (!verification) {
      return res.status(400).json({ error: 'No OTP sent. Request login first.' });
    }
    
    if (Date.now() > verification.expires) {
      pendingVerifications.delete(phone_number);
      return res.status(400).json({ error: 'OTP expired. Request new code.' });
    }
    
    if (verification.attempts >= 3) {
      pendingVerifications.delete(phone_number);
      return res.status(400).json({ error: 'Too many failed attempts. Request new code.' });
    }
    
    if (otp !== verification.otp) {
      verification.attempts++;
      pendingVerifications.set(phone_number, verification);
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // OTP verified - create or get user
    // TODO: Query database for user
    const user = {
      id: 'user_' + Date.now(),
      phone_number,
      username: phone_number.replace('+7', 'user_'),
      is_gold: false
    };
    
    // Generate JWT token (7 days expiry for mobile)
    const token = jwt.sign(
      { userId: user.id, phone: user.phone_number },
      process.env.JWT_SECRET || 'zzzap-dev-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    // Clean up
    pendingVerifications.delete(phone_number);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        username: user.username,
        is_gold: user.is_gold
      },
      expires_in: 7 * 24 * 60 * 60 // 7 days
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /auth/logout
 * Logout user (client should discard token)
 */
router.post('/logout', async (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
