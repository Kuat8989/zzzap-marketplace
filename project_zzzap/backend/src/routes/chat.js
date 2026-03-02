/**
 * Chat Routes - Mobile Optimized
 * GET /conversations - List all active chats
 * GET /conversations/:id/messages - Get message history
 * POST /conversations/:id/messages - Send a message
 * POST /conversations - Start new conversation
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

// Mock conversations (replace with DB + WebSockets for real-time)
const conversations = [
  {
    id: 'conv_1',
    product_id: 'prod_1',
    product_title: 'iPhone 15 Pro Max',
    product_thumbnail: 'https://zzzap.app/thumbs/iphone15.jpg',
    other_user: {
      id: 'user_seller',
      username: 'apple_store_kz',
      avatar_url: 'https://zzzap.app/avatars/seller.png',
      is_online: true,
      is_gold: true
    },
    last_message: {
      content: 'Здравствуйте! Товар ещё доступен?',
      sender_id: 'user_123',
      timestamp: '2026-02-22T15:30:00Z'
    },
    unread_count: 0,
    updated_at: '2026-02-22T15:30:00Z'
  },
  {
    id: 'conv_2',
    product_id: 'prod_2',
    product_title: 'Nike Air Jordan 1',
    product_thumbnail: 'https://zzzap.app/thumbs/jordan1.jpg',
    other_user: {
      id: 'user_buyer',
      username: 'sneaker_fan',
      avatar_url: 'https://zzzap.app/avatars/buyer.png',
      is_online: false,
      is_gold: false
    },
    last_message: {
      content: 'Спасибо за покупку!',
      sender_id: 'user_buyer',
      timestamp: '2026-02-21T18:00:00Z'
    },
    unread_count: 1,
    updated_at: '2026-02-21T18:00:00Z'
  }
];

// Mock messages
const messages = {
  'conv_1': [
    {
      id: 'msg_1',
      conversation_id: 'conv_1',
      sender_id: 'user_123',
      content: 'Здравствуйте! Товар ещё доступен?',
      is_read: true,
      created_at: '2026-02-22T15:30:00Z'
    }
  ],
  'conv_2': [
    {
      id: 'msg_2',
      conversation_id: 'conv_2',
      sender_id: 'user_123',
      content: 'Привет! Когда можно забрать?',
      is_read: true,
      created_at: '2026-02-21T17:00:00Z'
    },
    {
      id: 'msg_3',
      conversation_id: 'conv_2',
      sender_id: 'user_buyer',
      content: 'Спасибо за покупку!',
      is_read: false,
      created_at: '2026-02-21T18:00:00Z'
    }
  ]
};

/**
 * GET /conversations
 * List all active chats
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Query database
    // ORDER BY updated_at DESC for mobile (show recent first)
    
    res.json({
      success: true,
      conversations,
      total_unread: conversations.reduce((sum, c) => sum + c.unread_count, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

/**
 * POST /conversations
 * Start new conversation about a product
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, seller_id, initial_message } = req.body;
    
    if (!product_id || !seller_id) {
      return res.status(400).json({ error: 'Product ID and seller ID required' });
    }
    
    // TODO: Check if conversation already exists
    // TODO: Create new conversation in DB
    
    const newConversation = {
      id: 'conv_' + uuidv4(),
      product_id,
      product_title: 'Product Title',
      product_thumbnail: 'https://zzzap.app/thumbs/default.jpg',
      other_user: {
        id: seller_id,
        username: 'seller_username',
        avatar_url: 'https://zzzap.app/avatars/default.png',
        is_online: false,
        is_gold: false
      },
      last_message: {
        content: initial_message || 'Здравствуйте!',
        sender_id: req.userId,
        timestamp: new Date().toISOString()
      },
      unread_count: 0,
      updated_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      conversation: newConversation
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * GET /conversations/:id/messages
 * Get message history
 */
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, cursor } = req.query;
    
    // Mobile optimization: limit messages per request
    const mobileLimit = Math.min(parseInt(limit), 100);
    
    // TODO: Query database with cursor-based pagination
    const conversationMessages = messages[req.params.id] || [];
    
    res.json({
      success: true,
      messages: conversationMessages.slice(-mobileLimit),
      conversation_id: req.params.id,
      has_more: conversationMessages.length > mobileLimit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

/**
 * POST /conversations/:id/messages
 * Send a message
 */
router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { content, attachment_url } = req.body;
    
    if (!content && !attachment_url) {
      return res.status(400).json({ error: 'Message content or attachment required' });
    }
    
    // TODO: Save to database
    // TODO: Send WebSocket notification to recipient
    
    const newMessage = {
      id: 'msg_' + uuidv4(),
      conversation_id: req.params.id,
      sender_id: req.userId,
      content: content || '',
      attachment_url: attachment_url || null,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    // Add to mock storage
    if (!messages[req.params.id]) {
      messages[req.params.id] = [];
    }
    messages[req.params.id].push(newMessage);
    
    // TODO: Update conversation last_message and updated_at
    
    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * PUT /conversations/:id/read
 * Mark conversation as read
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    // TODO: Update unread_count to 0 in DB
    
    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
