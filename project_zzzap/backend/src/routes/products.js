/**
 * Product Routes - Mobile Optimized
 * POST /products - Create new listing (video upload)
 * GET /products/:id - Get single product
 * PUT /products/:id - Update product
 * DELETE /products/:id - Delete product
 * POST /products/:id/like - Like product
 * DELETE /products/:id/like - Unlike product
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Mobile-optimized multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for mobile uploads
const fileFilter = (req, file, cb) => {
  // Accept video and image formats
  const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (videoTypes.includes(file.mimetype) || imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, MOV, JPEG, PNG, WebP allowed.'), false);
  }
};

// Mobile-optimized upload limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for mobile uploads
    files: 5 // Max 5 files per request
  }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  req.userId = 'user_123'; // Mock
  next();
};

/**
 * POST /products
 * Create new listing with video
 * Mobile: Supports multipart upload
 */
router.post('/', authMiddleware, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 4 }
]), async (req, res) => {
  try {
    const { title, description, price, category, condition, location_lat, location_lng } = req.body;
    
    // Validate required fields
    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price, and category required' });
    }
    
    // Validate video upload
    if (!req.files.video || !req.files.video[0]) {
      return res.status(400).json({ error: 'Video required for listing' });
    }
    
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const imageFiles = req.files.images || [];
    
    // TODO: Upload to S3/CloudFront
    // TODO: Process video (compress, generate thumbnail)
    // TODO: Save to database
    
    const newProduct = {
      id: 'prod_' + uuidv4(),
      seller_id: req.userId,
      title,
      description: description || '',
      price: parseFloat(price),
      currency: 'KZT',
      video_url: `https://zzzap.app/uploads/${videoFile.filename}`,
      thumbnail_url: thumbnailFile ? `https://zzzap.app/uploads/${thumbnailFile.filename}` : null,
      additional_images: imageFiles.map(f => `https://zzzap.app/uploads/${f.filename}`),
      category,
      condition: condition || 'New',
      location_lat: location_lat ? parseFloat(location_lat) : null,
      location_lng: location_lng ? parseFloat(location_lng) : null,
      status: 'active',
      views_count: 0,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Product created',
      product: newProduct
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * GET /products/:id
 * Get single product details
 */
router.get('/:id', async (req, res) => {
  try {
    // TODO: Query database
    const product = {
      id: req.params.id,
      seller_id: 'user_1',
      title: 'iPhone 15 Pro Max',
      description: 'Новый, запечатанный. Гарантия 1 год.',
      price: 650000,
      currency: 'KZT',
      video_url: 'https://zzzap.app/videos/iphone15.mp4',
      thumbnail_url: 'https://zzzap.app/thumbs/iphone15.jpg',
      additional_images: [
        'https://zzzap.app/images/iphone15_1.jpg',
        'https://zzzap.app/images/iphone15_2.jpg'
      ],
      category: 'Electronics',
      condition: 'New',
      location_lat: 43.2220,
      location_lng: 76.8512,
      status: 'active',
      views_count: 1235,
      likes_count: 89,
      created_at: '2026-02-20T10:00:00Z',
      seller: {
        id: 'user_1',
        username: 'apple_store_kz',
        display_name: 'Apple Store KZ',
        is_gold: true,
        reputation_score: 150
      }
    };
    
    // Increment view count
    // TODO: UPDATE products SET views_count = views_count + 1 WHERE id = ?
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
});

/**
 * PUT /products/:id
 * Update product
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, status } = req.body;
    
    // TODO: Update database
    const updatedProduct = {
      id: req.params.id,
      title: title || 'Existing Title',
      description: description || '',
      price: price ? parseFloat(price) : 0,
      status: status || 'active'
    };
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /products/:id
 * Delete product (soft delete - set status to archived)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // TODO: Update status to 'archived'
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * POST /products/:id/like
 * Like a product
 */
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    // TODO: Add to likes table
    res.json({ success: true, is_liked: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like' });
  }
});

/**
 * DELETE /products/:id/like
 * Unlike a product
 */
router.delete('/:id/like', authMiddleware, async (req, res) => {
  try {
    // TODO: Remove from likes table
    res.json({ success: true, is_liked: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike' });
  }
});

module.exports = router;
