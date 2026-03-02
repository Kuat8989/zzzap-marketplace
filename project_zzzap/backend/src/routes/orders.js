/**
 * Order Routes - Mobile Optimized
 * POST /orders/create - Initialize purchase
 * POST /orders/:id/pay - Process payment
 * GET /orders/me - List my purchases and sales
 * GET /orders/:id - Get order details
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

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
 * POST /orders/create
 * Initialize purchase
 */
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { product_id, delivery_address, delivery_phone } = req.body;
    
    if (!product_id || !delivery_address) {
      return res.status(400).json({ error: 'Product ID and delivery address required' });
    }
    
    // TODO: Get product from DB
    // TODO: Calculate platform fee (e.g., 5%)
    // TODO: Create order in database
    
    const productPrice = 650000; // Mock
    const feeAmount = productPrice * 0.05; // 5% platform fee
    const totalAmount = productPrice + feeAmount;
    
    const order = {
      id: 'order_' + uuidv4(),
      buyer_id: req.userId,
      seller_id: 'seller_123',
      product_id,
      amount: productPrice,
      fee_amount: feeAmount,
      total_amount: totalAmount,
      status: 'pending',
      delivery_address,
      delivery_phone: delivery_phone || '',
      tracking_number: null,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Order created',
      order,
      next_step: 'payment',
      payment_url: `/api/v1/orders/${order.id}/pay`
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * POST /orders/:id/pay
 * Process payment (Kaspi Pay / Stripe / etc.)
 */
router.post('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const { payment_method, payment_token } = req.body;
    
    // TODO: Process payment via payment gateway
    // Kaspi Pay, Stripe, or local payment provider
    
    const order = {
      id: req.params.id,
      status: 'paid',
      payment_method: payment_method || 'kaspi',
      paid_at: new Date().toISOString()
    };
    
    // TODO: Update order status in DB
    // TODO: Notify seller
    
    res.json({
      success: true,
      message: 'Payment successful',
      order: {
        ...order,
        status: 'paid',
        next_step: 'seller_ships'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

/**
 * GET /orders/me
 * List my purchases and sales
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { type = 'all', status } = req.query;
    
    // TODO: Query database
    // type: 'all' | 'buying' | 'selling'
    
    const orders = [
      {
        id: 'order_1',
        type: 'buying',
        product: {
          id: 'prod_1',
          title: 'iPhone 15 Pro Max',
          thumbnail_url: 'https://zzzap.app/thumbs/iphone15.jpg'
        },
        seller: { username: 'apple_store_kz' },
        amount: 650000,
        status: 'pending',
        created_at: '2026-02-22T10:00:00Z'
      },
      {
        id: 'order_2',
        type: 'selling',
        product: {
          id: 'prod_2',
          title: 'AirPods Pro 2',
          thumbnail_url: 'https://zzzap.app/thumbs/airpods.jpg'
        },
        buyer: { username: 'buyer_kz' },
        amount: 120000,
        status: 'paid',
        created_at: '2026-02-21T15:30:00Z'
      }
    ];
    
    let filtered = orders;
    
    if (type !== 'all') {
      filtered = filtered.filter(o => o.type === type);
    }
    
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    res.json({
      success: true,
      orders: filtered,
      counts: {
        total: orders.length,
        buying: orders.filter(o => o.type === 'buying').length,
        selling: orders.filter(o => o.type === 'selling').length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid: orders.filter(o => o.status === 'paid').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

/**
 * GET /orders/:id
 * Get order details
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // TODO: Query database
    const order = {
      id: req.params.id,
      buyer: {
        id: 'buyer_123',
        username: 'buyer_kz',
        phone: '+77771234567'
      },
      seller: {
        id: 'seller_123',
        username: 'seller_kz',
        phone: '+77779876543'
      },
      product: {
        id: 'prod_1',
        title: 'iPhone 15 Pro Max',
        video_url: 'https://zzzap.app/videos/iphone15.mp4',
        thumbnail_url: 'https://zzzap.app/thumbs/iphone15.jpg'
      },
      amount: 650000,
      fee_amount: 32500,
      total_amount: 682500,
      status: 'pending',
      delivery_address: 'Almaty, st. Abai 123, apt. 45',
      tracking_number: null,
      timeline: [
        { status: 'created', timestamp: '2026-02-22T10:00:00Z', label: 'Заказ создан' },
        { status: 'pending', timestamp: '2026-02-22T10:00:01Z', label: 'Ожидает оплаты' }
      ],
      created_at: '2026-02-22T10:00:00Z'
    };
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get order' });
  }
});

module.exports = router;
