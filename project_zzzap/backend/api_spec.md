# Zzzap! API Routes Specification (v1)

Base URL: `https://api.zzzap.app/v1`

## 1. Auth & Users
- **POST /auth/login** - Login via Phone/SMS (Twilio/Firebase).
- **POST /auth/verify** - Verify OTP code.
- **GET /users/me** - Get current user profile.
- **PUT /users/me** - Update profile (bio, avatar).
- **GET /users/:id** - Get public profile of another user.
- **POST /users/:id/follow** - Follow a user.
- **DELETE /users/:id/follow** - Unfollow.

## 2. Feed & Discovery (The Core)
- **GET /feed/main** - Main infinite scroll feed.
  - *Params:* `cursor` (pagination), `city` (optional filter).
  - *Response:* List of video products.
- **GET /feed/search** - Search products.
  - *Params:* `q` (query), `category`, `min_price`, `max_price`.
- **GET /products/:id** - Get single product details.

## 3. Commerce (Buying & Selling)
- **POST /products** - Create new listing.
  - *Body:* `video_file` (multipart), `title`, `price`, `description`.
- **POST /orders/create** - Initialize purchase.
  - *Body:* `product_id`, `delivery_address`.
- **POST /orders/:id/pay** - Process payment webhook.
- **GET /orders/me** - List my purchases and sales.

## 4. Chat & Messaging
- **GET /conversations** - List all active chats.
- **GET /conversations/:id/messages** - Get message history.
- **POST /conversations/:id/messages** - Send a message.
  - *Body:* `text`, `attachment_url` (optional).

## 5. Gamification (Gold Status)
- **GET /gamification/status** - Check current progress to Gold.
- **POST /gamification/claim-gold** - Upgrade status if eligible.

---

## Technical Notes for Backend Team:
1. **Video Handling:** Use AWS S3 + CloudFront for video delivery. Videos must be compressed (H.264/H.265) on upload.
2. **Real-time:** Use WebSockets (Socket.io or Pusher) for Chat and Notifications.
3. **Search:** Use Elasticsearch or Postgres Full Text Search for product discovery.
