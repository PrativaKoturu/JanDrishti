# WhatsApp Integration Setup Guide

This guide explains how to set up WhatsApp notifications using Twilio for JanDrishti.

## Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com)
2. **Twilio WhatsApp Sandbox** or **Approved WhatsApp Business Account**
3. **Supabase Database** with the WhatsApp subscriptions table

## Step 1: Set Up Twilio

### 1.1 Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com) and sign up
2. Verify your phone number and email

### 1.2 Get Twilio Credentials
1. Go to Twilio Console Dashboard
2. Find your **Account SID** and **Auth Token**
3. Copy these values (you'll need them for environment variables)

### 1.3 Set Up WhatsApp

#### Option A: Use Twilio WhatsApp Sandbox (For Testing)
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join the sandbox
3. You'll get a WhatsApp number like `whatsapp:+14155238886`
4. Note this number for `TWILIO_WHATSAPP_FROM`

#### Option B: Use Approved WhatsApp Business Account (For Production)
1. Go to **Messaging** → **Settings** → **WhatsApp Senders**
2. Request approval for your WhatsApp Business Account
3. Once approved, you'll get a WhatsApp number
4. Use this number for `TWILIO_WHATSAPP_FROM`

## Step 2: Database Setup

Run the SQL schema in your Supabase SQL Editor:

```sql
-- File: backend/whatsapp_subscriptions_schema.sql
```

This creates the `whatsapp_subscriptions` table with proper RLS policies.

## Step 3: Environment Variables

Add these to your backend `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Supabase (if not already set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Step 4: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The `requirements.txt` already includes `twilio==9.3.0`.

## Step 5: Start the Services

The WhatsApp scheduler is automatically started with the FastAPI app. It will:
- Send daily AQI updates at 8 AM IST
- Send critical alerts (AQI > 200) hourly
- Handle subscription management

## How It Works

### User Flow
1. User logs into JanDrishti
2. User clicks "Subscribe to WhatsApp" in the Alerts Panel
3. User enters phone number and selects preferences
4. System sends welcome message via WhatsApp
5. User receives daily AQI updates and precautions

### Message Types

#### Daily AQI Update
- Sent at 8 AM IST daily
- Includes current AQI, PM2.5, PM10 levels
- Provides health advice based on AQI level
- Includes precautions

#### Critical Alerts
- Sent hourly when AQI > 200
- Includes emergency precautions
- Provides helpline numbers

#### Precautions Update
- Sent automatically when AQI > 150
- Includes specific precautions based on AQI level
- Provides actionable health advice

## API Endpoints

### Subscribe
```
POST /api/whatsapp/subscribe
Body: {
  "phone_number": "+919876543210",
  "ward_no": "72",
  "subscription_type": "aqi_updates",
  "frequency": "daily"
}
```

### Get Subscription Status
```
GET /api/whatsapp/subscription
```

### Update Subscription
```
PUT /api/whatsapp/subscription/{subscription_id}
Body: {
  "ward_no": "27",
  "frequency": "hourly"
}
```

### Unsubscribe
```
DELETE /api/whatsapp/subscription/{subscription_id}
```

## Phone Number Format

Phone numbers should be in E.164 format:
- India: `+919876543210`
- The system automatically formats numbers if country code is missing

## Testing

1. **Test Subscription**:
   - Login to JanDrishti
   - Click "Subscribe to WhatsApp" button
   - Enter your phone number
   - You should receive a welcome message

2. **Test Daily Updates**:
   - Wait for 8 AM IST or manually trigger the scheduler
   - Check your WhatsApp for AQI update

3. **Test Critical Alerts**:
   - Set AQI to > 200 in test data
   - Wait for hourly check or manually trigger
   - Check WhatsApp for critical alert

## Troubleshooting

### Messages Not Sending
1. Check Twilio credentials in `.env`
2. Verify `TWILIO_WHATSAPP_FROM` format: `whatsapp:+14155238886`
3. Check Twilio console for error logs
4. Verify phone number format (E.164)

### Sandbox Limitations
- Sandbox only works with pre-approved numbers
- For production, you need an approved WhatsApp Business Account

### Rate Limits
- Twilio has rate limits based on your account tier
- Free tier: Limited messages per month
- Check Twilio console for your limits

## Cost Considerations

- Twilio charges per WhatsApp message
- Check [Twilio Pricing](https://www.twilio.com/pricing) for current rates
- Consider message frequency to control costs

## Security Notes

1. Never commit `.env` file to git
2. Use environment variables for all secrets
3. Twilio credentials should be kept secure
4. Use Supabase RLS policies to protect user data

## Support

For issues:
1. Check Twilio console logs
2. Check backend logs for errors
3. Verify database schema is correct
4. Ensure all environment variables are set
