/**
 * Feed Routes - Mobile Optimized
 * GET /feed/main - Main infinite scroll feed
 * GET /feed/search - Search products
 * GET /feed/trending - Trending products
 */

const express = require('express');
const router = express.Router();

// Mock products data (replace with DB)
const mockProducts = [
  {
    id: 'prod_1',
    seller_id: 'user_1',
    title: 'iPhone 15 Pro Max',
    description: 'Новый, запечатанный',
    price: 650000,
    currency: 'KZT',
    video_url: 'https://zzzap.app/videos/iphone15.mp4',
    thumbnail_url: 'https://zzzap.app/thumbs/iphone15.jpg',
    category: 'Electronics',
    condition: 'New',
    location_lat: 43.2220,
    location_lng: 76.8512,
    status: 'active',
    views_count: 1234,
    likes_count: 89,
    seller: { username: 'apple_store_kz', is_gold: true }
  },
  {
    id: 'prod_2',
    seller_id: 'user_2',
    title: 'Nike Air Jordan 1',
    description: 'Оригинал, размер 42',
    price: 85000,
    currency: 'KZT',
    video_url: 'https://zzzap.app/videos/jordan1.mp4',
    thumbnail_url: 'https://zzzap.app/thumbs/jordan1.jpg',
    category: 'Fashion',
    condition: 'Like New',
    location_lat: 51.1694,
    location_lng: 71.4491,
    status: 'active',
    views_count: 567,
    likes_count: 45,
    seller: { username: 'sneaker_kz', is_gold: false }
  },
  {
    id: 'prod_3',
    seller_id: 'user_3',
    title: 'MacBook Pro M3',
    description: '14 дюймов, 512GB',
    price: 950000,
    currency: 'KZT',
    video_url: 'https://zzzap.app/videos/macbook.mp4',
    thumbnail_url: 'https://zzzap.app/thumbs/macbook.jpg',
    category: 'Electronics',
    condition: 'New',
    location_lat: 43.2389,
    location_lng: 76.9453,
    status: 'active',
    views_count: 2341,
    likes_count: 156,
    seller: { username: 'tech_store', is_gold: true }
  }
];

/**
 * GET /feed/main
 * Main infinite scroll feed - optimized for mobile
 */
router.get('/main', async (req, res) => {
  try {
    const { cursor, city, limit = 10 } = req.query;
    
    // Mobile optimization: limit max items per request
    const mobileLimit = Math.min(parseInt(limit), 20);
    
    // TODO: Query database with cursor-based pagination
    // SELECT * FROM products WHERE status='active' ORDER BY created_at DESC LIMIT mobileLimit
    
    const hasMore = mockProducts.length > mobileLimit;
    const nextCursor = hasMore ? 'cursor_next_page' : null;
    
    res.json({
      success: true,
      data: mockProducts.slice(0, mobileLimit),
      pagination: {
        cursor: nextCursor,
        has_more: hasMore,
        count: mockProducts.length
      },
      mobile_optimized: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load feed' });
  }
});

/**
 * GET /feed/search
 * Search products - mobile optimized
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, min_price, max_price, cursor, limit = 10 } = req.query;
    
    // Mobile optimization: limit results
    const mobileLimit = Math.min(parseInt(limit), 20);
    
    // TODO: Query database with search filters
    // Use Elasticsearch or Postgres Full Text Search
    
    let results = mockProducts;
    
    if (category) {
      results = results.filter(p => p.category === category);
    }
    
    if (min_price) {
      results = results.filter(p => p.price >= parseFloat(min_price));
    }
    
    if (max_price) {
      results = results.filter(p => p.price <= parseFloat(max_price));
    }
    
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    res.json({
      success: true,
      data: results.slice(0, mobileLimit),
      pagination: {
        cursor: results.length > mobileLimit ? 'next' : null,
        has_more: results.length > mobileLimit,
        count: results.length,
        query: q
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /feed/trending
 * Trending products (most views/likes in last 24h)
 */
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const mobileLimit = Math.min(parseInt(limit), 20);
    
    // TODO: Query database for trending products
    // ORDER BY (views_count + likes_count * 2) DESC
    
    const trending = [...mockProducts].sort((a, b) => 
      (b.views_count + b.likes_count * 2) - (a.views_count + a.likes_count * 2)
    );
    
    res.json({
      success: true,
      data: trending.slice(0, mobileLimit),
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load trending' });
  }
});

module.exports = router;
