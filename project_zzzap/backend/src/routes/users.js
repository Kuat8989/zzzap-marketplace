/**
 * User Routes - Mobile Optimized
 * GET /users/me - Current user profile
 * PUT /users/me - Update profile
 * GET /users/:id - Public profile
 * POST /users/:id/follow - Follow user
 * DELETE /users/:id/follow - Unfollow
 */

const express = require('express');
const router = express.Router();

// Mock user data (replace with DB)
const users = new Map();

// Middleware to verify JWT (simplified)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  // TODO: Verify JWT token
  req.userId = 'user_123'; // Mock
  next();
};

/**
 * GET /users/me
 * Get current user profile
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // TODO: Query database
    const user = {
      id: req.userId,
      phone_number: '+77771234567',
      username: 'kuat_zzzap',
      display_name: 'Куат',
      bio: 'Founder @ Zzzap! ⚡️',
      avatar_url: 'https://zzzap.app/avatars/default.png',
      city: 'Almaty',
      is_gold: false,
      reputation_score: 0,
      followers_count: 0,
      following_count: 0,
      products_count: 0
    };
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * PUT /users/me
 * Update current user profile
 */
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { display_name, bio, avatar_url, city } = req.body;
    
    // TODO: Update database
    const updatedUser = {
      id: req.userId,
      display_name: display_name || 'Куат',
      bio: bio || '',
      avatar_url: avatar_url || 'https://zzzap.app/avatars/default.png',
      city: city || 'Almaty'
    };
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * GET /users/:id
 * Get public profile of another user
 */
router.get('/:id', async (req, res) => {
  try {
    // TODO: Query database
    const user = {
      id: req.params.id,
      username: 'seller_123',
      display_name: 'Продавец',
      bio: 'Продаю крутые вещи!',
      avatar_url: 'https://zzzap.app/avatars/seller.png',
      city: 'Astana',
      is_gold: true,
      reputation_score: 42,
      followers_count: 150,
      following_count: 89,
      products_count: 12,
      is_following: false // Check if current user follows
    };
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * POST /users/:id/follow
 * Follow a user
 */
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    // TODO: Add to follows table
    res.json({ 
      success: true, 
      message: 'Following',
      is_following: true 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow' });
  }
});

/**
 * DELETE /users/:id/follow
 * Unfollow a user
 */
router.delete('/:id/follow', authMiddleware, async (req, res) => {
  try {
    // TODO: Remove from follows table
    res.json({ 
      success: true, 
      message: 'Unfollowed',
      is_following: false 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow' });
  }
});

module.exports = router;
