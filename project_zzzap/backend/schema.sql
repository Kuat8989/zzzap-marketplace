-- Zzzap! Database Schema (PostgreSQL)
-- Version: 1.0.0
-- Created for: Kuat (Zzzap! Founder)

-- 1. Users & Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    city VARCHAR(100) DEFAULT 'Astana',
    
    -- Status & Gamification
    is_gold BOOLEAN DEFAULT FALSE,
    gold_status_expiry TIMESTAMP WITH TIME ZONE,
    reputation_score INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products (Listings)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KZT',
    
    -- Media
    video_url TEXT NOT NULL, -- Main video feed content
    thumbnail_url TEXT NOT NULL,
    additional_images TEXT[], -- Array of image URLs
    
    -- Metadata
    category VARCHAR(50) NOT NULL, -- Electronics, Fashion, Home, etc.
    condition VARCHAR(20) NOT NULL, -- New, Like New, Good, Fair
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    
    -- State
    status VARCHAR(20) DEFAULT 'active', -- active, reserved, sold, archived
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Social Graph
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id),
    following_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- 4. Commerce & Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    
    amount DECIMAL(10, 2) NOT NULL,
    fee_amount DECIMAL(10, 2) DEFAULT 0, -- Platform fee
    
    status VARCHAR(30) DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled, disputed
    tracking_number VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chat System
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id), -- Chat usually starts about a product
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id),
    user_id UUID REFERENCES users(id),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
