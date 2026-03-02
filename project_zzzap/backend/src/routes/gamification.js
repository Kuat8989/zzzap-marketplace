/**
 * Gamification Routes - Mobile Optimized
 * GET /gamification/status - Check Gold status progress
 * POST /gamification/claim-gold - Upgrade to Gold if eligible
 * GET /gamification/leaderboard - Top users
 */

const express = require('express');
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  req.userId = 'user_123'; // Mock
  next();
};

// Gold status requirements
const GOLD_REQUIREMENTS = {
  min_reputation: 50,
  min_sales: 5,
  min_response_rate: 80, // percentage
  min_avg_rating: 4.5
};

/**
 * GET /gamification/status
 * Check current user's Gold status progress
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    // TODO: Query database for user stats
    const userStats = {
      reputation_score: 35,
      total_sales: 3,
      response_rate: 92,
      avg_rating: 4.7,
      total_views: 1250,
      total_likes: 89
    };
    
    // Calculate progress for each requirement
    const progress = {
      reputation: Math.min(100, (userStats.reputation_score / GOLD_REQUIREMENTS.min_reputation) * 100),
      sales: Math.min(100, (userStats.total_sales / GOLD_REQUIREMENTS.min_sales) * 100),
      response_rate: Math.min(100, (userStats.response_rate / GOLD_REQUIREMENTS.min_response_rate) * 100),
      rating: Math.min(100, (userStats.avg_rating / GOLD_REQUIREMENTS.min_avg_rating) * 100)
    };
    
    // Check if eligible for Gold
    const isEligible = 
      userStats.reputation_score >= GOLD_REQUIREMENTS.min_reputation &&
      userStats.total_sales >= GOLD_REQUIREMENTS.min_sales &&
      userStats.response_rate >= GOLD_REQUIREMENTS.min_response_rate &&
      userStats.avg_rating >= GOLD_REQUIREMENTS.min_avg_rating;
    
    // Calculate overall progress
    const overallProgress = Math.round(
      (progress.reputation + progress.sales + progress.response_rate + progress.rating) / 4
    );
    
    res.json({
      success: true,
      is_gold: false,
      is_eligible: isEligible,
      overall_progress: overallProgress,
      requirements: {
        reputation: {
          current: userStats.reputation_score,
          required: GOLD_REQUIREMENTS.min_reputation,
          progress: Math.round(progress.reputation),
          label: 'Репутация'
        },
        sales: {
          current: userStats.total_sales,
          required: GOLD_REQUIREMENTS.min_sales,
          progress: Math.round(progress.sales),
          label: 'Продажи'
        },
        response_rate: {
          current: userStats.response_rate,
          required: GOLD_REQUIREMENTS.min_response_rate,
          progress: Math.round(progress.response_rate),
          label: 'Ответы'
        },
        rating: {
          current: userStats.avg_rating,
          required: GOLD_REQUIREMENTS.min_avg_rating,
          progress: Math.round(progress.rating),
          label: 'Рейтинг'
        }
      },
      benefits: [
        'Значок Gold в профиле',
        'Приоритет в ленте',
        'Сниженная комиссия (3% вместо 5%)',
        'Поддержка 24/7'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

/**
 * POST /gamification/claim-gold
 * Upgrade to Gold status if eligible
 */
router.post('/claim-gold', authMiddleware, async (req, res) => {
  try {
    // TODO: Check eligibility in database
    // TODO: Update user is_gold = true
    // TODO: Set gold_status_expiry (e.g., 30 days)
    
    const isEligible = true; // Mock - should check DB
    
    if (!isEligible) {
      return res.status(400).json({ 
        error: 'Not eligible yet',
        hint: 'Complete the requirements to unlock Gold status'
      });
    }
    
    const goldStatus = {
      is_gold: true,
      activated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      benefits_active: true
    };
    
    res.json({
      success: true,
      message: '🎉 Поздравляем! Вы получили Gold статус!',
      gold: goldStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to claim Gold' });
  }
});

/**
 * GET /gamification/leaderboard
 * Top users by reputation/sales
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'reputation', limit = 10 } = req.query;
    
    // Mobile optimization: limit results
    const mobileLimit = Math.min(parseInt(limit), 50);
    
    // TODO: Query database
    const leaderboard = [
      { rank: 1, user_id: 'user_1', username: 'top_seller_kz', reputation_score: 500, is_gold: true, avatar_url: 'https://zzzap.app/avatars/1.png' },
      { rank: 2, user_id: 'user_2', username: 'apple_store_kz', reputation_score: 450, is_gold: true, avatar_url: 'https://zzzap.app/avatars/2.png' },
      { rank: 3, user_id: 'user_3', username: 'tech_master', reputation_score: 380, is_gold: true, avatar_url: 'https://zzzap.app/avatars/3.png' },
      { rank: 4, user_id: 'user_4', username: 'fashion_kz', reputation_score: 320, is_gold: true, avatar_url: 'https://zzzap.app/avatars/4.png' },
      { rank: 5, user_id: 'user_5', username: 'gadget_pro', reputation_score: 290, is_gold: false, avatar_url: 'https://zzzap.app/avatars/5.png' }
    ];
    
    res.json({
      success: true,
      leaderboard: leaderboard.slice(0, mobileLimit),
      type,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

module.exports = router;
