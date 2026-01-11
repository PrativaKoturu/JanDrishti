# WhatsApp Integration Activation Guide

Follow these steps to activate WhatsApp notifications for JanDrishti.

## Step 1: Database Setup

### 1.1 Run the Database Schema

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire content from `backend/whatsapp_subscriptions_schema.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Verify the table was created:
   - Go to **Table Editor**
   - You should see `whatsapp_subscriptions` table

**Expected Result:** Table `whatsapp_subscriptions` created with proper indexes and RLS policies.

---

## Step 2: Set Up Twilio Account

### 2.1 Create Twilio Account

1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Click **Sign Up** (or **Sign In** if you have an account)
3. Complete the registration:
   - Enter your email
   - Verify your email
   - Verify your phone number
   - Complete account setup

### 2.2 Get Twilio Credentials

1. After logging in, you'll see the **Twilio Console Dashboard**
2. Find your **Account SID** (starts with `AC...`)
   - It's displayed on the dashboard
   - Or go to **Settings** → **General**
3. Find your **Auth Token**
   - Click the eye icon to reveal it
   - **Important:** Copy this immediately (you can't see it again)

### 2.3 Set Up WhatsApp (Choose One Option)

#### Option A: WhatsApp Sandbox (For Testing - FREE)

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see a WhatsApp number like `whatsapp:+14155238886`
3. Follow the instructions to join the sandbox:
   - Send the code to the WhatsApp number shown
   - You'll receive a confirmation
4. **Note the WhatsApp number** (format: `whatsapp:+14155238886`)
5. **Limitation:** Only works with numbers you've added to the sandbox

#### Option B: WhatsApp Business Account (For Production)

1. Go to **Messaging** → **Settings** → **WhatsApp Senders**
2. Click **Request WhatsApp Sender**
3. Fill out the form:
   - Business name
   - Business description
   - Use case
   - Expected message volume
4. Wait for approval (can take 1-3 business days)
5. Once approved, you'll get a WhatsApp number
6. **Note the WhatsApp number**

---

## Step 3: Configure Environment Variables

### 3.1 Backend Environment Variables

1. Navigate to your backend directory:
   ```bash
   cd JanDrishti-Pollution-Action-DashBoard/backend
   ```

2. Open or create `.env` file:
   ```bash
   # On Windows
   notepad .env
   
   # On Mac/Linux
   nano .env
   ```

3. Add these lines to your `.env` file:
   ```env
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   
   # Supabase (if not already present)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Replace the values:**
   - `TWILIO_ACCOUNT_SID`: Your Account SID from Step 2.2
   - `TWILIO_AUTH_TOKEN`: Your Auth Token from Step 2.2
   - `TWILIO_WHATSAPP_FROM`: Your WhatsApp number from Step 2.3 (include `whatsapp:` prefix)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for admin operations)

5. **Save the file**

**⚠️ Important:** Never commit `.env` file to git. It contains sensitive credentials.

---

## Step 4: Install Dependencies

### 4.1 Install Python Dependencies

1. Make sure you're in the backend directory:
   ```bash
   cd JanDrishti-Pollution-Action-DashBoard/backend
   ```

2. Install/update dependencies:
   ```bash
   pip install -r requirements.txt
   ```

   Or if using a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Verify Twilio is installed:
   ```bash
   pip show twilio
   ```

   You should see `twilio==9.3.0` or similar.

---

## Step 5: Verify Configuration

### 5.1 Test Twilio Connection

1. Create a test script `test_twilio.py` in backend directory:
   ```python
   from twilio_service import get_twilio_service
   
   service = get_twilio_service()
   if service.is_configured():
       print("✅ Twilio is configured correctly")
       print(f"From number: {service.whatsapp_from}")
   else:
       print("❌ Twilio is not configured")
   ```

2. Run the test:
   ```bash
   python test_twilio.py
   ```

3. **Expected Output:** `✅ Twilio is configured correctly`

### 5.2 Verify Database Connection

1. Check if you can access Supabase:
   - Go to Supabase Dashboard
   - Verify `whatsapp_subscriptions` table exists
   - Check that RLS policies are enabled

---

## Step 6: Start the Backend Server

### 6.1 Start FastAPI Server

1. Make sure you're in the backend directory
2. Start the server:
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Check the console output:**
   - You should see: `✓ AQI Scheduler started`
   - You should see: `✓ WhatsApp Scheduler started`
   - If you see warnings, check your environment variables

4. **Verify endpoints are working:**
   - Open browser: `http://localhost:8000/api/health`
   - Should return: `{"status": "healthy", ...}`

---

## Step 7: Test the Integration

### 7.1 Test via Frontend

1. Start your frontend (if not already running):
   ```bash
   cd JanDrishti-Pollution-Action-DashBoard/frontend
   npm run dev
   ```

2. **Login to your account:**
   - Make sure your profile has a phone number in the `profiles` table
   - If not, add it via Supabase or update your profile

3. **Test Subscription:**
   - Go to the dashboard
   - Find the **Alerts Panel** (right side)
   - Click **"Subscribe to WhatsApp"** button
   - The phone number should be auto-filled from your profile
   - Click **"Subscribe to WhatsApp Updates"**
   - You should receive a welcome message on WhatsApp

4. **Verify Welcome Message:**
   - Check your WhatsApp
   - You should receive a message starting with "🌍 Welcome to JanDrishti WhatsApp Updates!"

### 7.2 Test via API (Optional)

1. Get your access token (from login)
2. Test subscription endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/whatsapp/subscribe \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "ward_no": "72",
       "frequency": "daily"
     }'
   ```

---

## Step 8: Verify Scheduled Jobs

### 8.1 Check Scheduler Status

1. The WhatsApp scheduler runs automatically:
   - **Daily updates:** 8 AM IST (2:30 AM UTC)
   - **Critical alerts:** Every hour (when AQI > 200)

2. **To test manually** (optional):
   - You can modify the scheduler to run immediately for testing
   - Or wait for the scheduled time

3. **Check logs:**
   - Monitor your backend console
   - Look for messages like: "Starting daily AQI WhatsApp updates"
   - Check for any error messages

---

## Step 9: Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Twilio service not configured"
**Solution:**
- Check `.env` file exists and has correct values
- Verify no extra spaces in environment variables
- Restart the backend server after changing `.env`

#### Issue 2: "Phone number not found in profile"
**Solution:**
- Go to Supabase → Table Editor → `profiles`
- Find your user record
- Add phone number in `phone` column (format: `+919876543210`)
- Try subscribing again

#### Issue 3: "Failed to send WhatsApp message"
**Solution:**
- Check Twilio console for error logs
- Verify WhatsApp number format: `whatsapp:+14155238886`
- For sandbox: Make sure you've joined the sandbox
- Check phone number format (E.164: `+919876543210`)

#### Issue 4: "WhatsApp Scheduler not started"
**Solution:**
- Check backend logs for error messages
- Verify all environment variables are set
- Check Twilio credentials are correct
- Ensure Supabase service key has proper permissions

#### Issue 5: Messages not received
**Solution:**
- Check Twilio console → Logs → Messaging
- Verify message status (sent, delivered, failed)
- For sandbox: Ensure recipient number is added to sandbox
- Check phone number format

---

## Step 10: Production Checklist

Before going to production:

- [ ] Twilio WhatsApp Business Account approved (not sandbox)
- [ ] All environment variables set in production environment
- [ ] Database schema deployed to production Supabase
- [ ] RLS policies tested and working
- [ ] Test messages sent and received successfully
- [ ] Scheduled jobs running correctly
- [ ] Error logging and monitoring set up
- [ ] Rate limits understood (check Twilio pricing)
- [ ] Backup plan for service outages

---

## Quick Reference

### Environment Variables Needed:
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

### Database Tables:
- `whatsapp_subscriptions` (created by schema)

### API Endpoints:
- `POST /api/whatsapp/subscribe` - Subscribe
- `GET /api/whatsapp/subscription` - Get status
- `PUT /api/whatsapp/subscription/{id}` - Update
- `DELETE /api/whatsapp/subscription/{id}` - Unsubscribe
- `POST /api/whatsapp/quick-subscribe` - Quick subscribe

### Files Modified/Created:
- `backend/whatsapp_subscriptions_schema.sql`
- `backend/twilio_service.py`
- `backend/whatsapp_scheduler.py`
- `backend/main.py` (endpoints added)
- `frontend/components/whatsapp-subscription-modal.tsx`
- `frontend/lib/api.ts` (whatsappService added)

---

## Support

If you encounter issues:
1. Check backend console logs
2. Check Twilio console → Logs
3. Check Supabase → Logs
4. Verify all environment variables
5. Test with a simple message first

---

**🎉 Once all steps are completed, your WhatsApp integration is active!**

Users can now subscribe and receive AQI updates and precautions on WhatsApp.
