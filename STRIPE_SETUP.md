# Stripe Integration Setup Guide

## 🚨 Error: Stripe API Key Missing

You're seeing this error because the Stripe API credentials are not configured in your environment variables.

## 📋 Setup Instructions

### 1. Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Create a free account (test mode is free)
3. Complete account verification

### 2. Get Stripe API Keys
1. Login to your Stripe Dashboard
2. Go to **Developers** → **API Keys**
3. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### 3. Configure Environment Variables
1. Copy `.env.local.template` to `.env.local`:
   ```bash
   cp .env.local.template .env.local
   ```

2. Edit `.env.local` and add your Stripe keys:
   ```bash
   # Stripe Configuration
   STRIPE_SECRET_KEY="sk_test_your_actual_secret_key_here"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_actual_publishable_key_here"
   ```

### 4. Optional: Webhook Configuration
For production or testing webhooks locally:
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Create a new webhook endpoint
3. Add the webhook secret to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   ```

### 5. Restart Development Server
After adding the environment variables:
```bash
npm run dev
```

## 🧪 Testing Payment Flow

### Test Credit Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., `12/25`)
- Any 3-digit CVC (e.g., `123`)
- Any billing postal code

### Testing the Cart → Checkout Flow
1. Add items to cart
2. Go to `/cart`
3. Click "Checkout" button
4. Use test credit card numbers above
5. Complete the payment flow

## 🔧 Development Mode Features

### Cart Without Stripe (Local Testing)
The cart functionality works independently of Stripe:
- Add/remove items ✅
- Update quantities ✅
- Persist cart data ✅
- Calculate totals ✅

### Stripe Integration Points
- Checkout process (requires Stripe keys)
- Payment processing
- Order completion
- Invoice generation

## 📁 Files Affected by Stripe Configuration

- `/api/stripe/payment/route.ts` - Main payment processing
- `/api/stripe/webhooks/route.ts` - Webhook handling
- `/api/stripe/checkout_sessions/route.ts` - Session management
- `ButtonCheckout.tsx` - Checkout button component

## 🛠️ Alternative Solutions

### Option 1: Mock Payment (Development)
If you want to test without Stripe, you can temporarily mock the payment flow.

### Option 2: Skip Checkout
Comment out checkout functionality and test other features.

### Option 3: Use Stripe Test Mode
Recommended: Set up Stripe test account (free) for full functionality.

## ✅ Verification Steps

1. Environment variables are set in `.env.local`
2. Development server restarted
3. No console errors about missing Stripe keys
4. Checkout button works without API errors

## 🔗 Helpful Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Integration Guide](https://stripe.com/docs/development)

---

**Need Help?** Check the console logs for specific error messages or verify your environment variables are loaded correctly.
