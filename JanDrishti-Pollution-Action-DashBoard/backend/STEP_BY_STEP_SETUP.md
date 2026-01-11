# Step-by-Step Setup: Email Notifications (5 Minutes)

## ✅ Simple Solution That Works Immediately!

No approval needed. No waiting. Works for all users right now.

---

## STEP 1: Setup Gmail (2 minutes)

### 1.1 Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process (verify your phone)
4. Click "Turn On"

### 1.2 Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other (Custom name)"
3. Enter name: `JanDrishti`
4. Click "Generate"
5. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
6. **Save this password** - you'll use it in Step 2

---

## STEP 2: Update .env File (1 minute)

Open `backend/.env` file and add these lines:

```env
# Email Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
FROM_NAME=JanDrishti AQI Updates
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with the 16-character app password from Step 1
- Remove spaces from the app password if any

---

## STEP 3: Restart Backend (30 seconds)

Stop your backend server and restart it:

```bash
# Stop backend (Ctrl+C)
# Then restart:
cd backend
python main.py
```

---

## STEP 4: Test It! (1 minute)

### Option A: Test via API

```bash
# First, get your auth token by logging in
# Then call the subscribe endpoint:
curl -X POST http://localhost:8000/api/email/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ward_no": "72"}'
```

### Option B: Test via Frontend

1. Login to your app
2. Go to Alerts/Notifications section
3. Click "Subscribe to Email Updates"
4. Check your email inbox!

---

## STEP 5: Deploy to Production (1 minute)

### For Render:

1. Go to Render Dashboard → Your Backend Service
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Add these variables one by one:

```
SMTP_SERVER = smtp.gmail.com
SMTP_PORT = 587
SMTP_EMAIL = your-email@gmail.com
SMTP_PASSWORD = your-16-char-password
FROM_EMAIL = your-email@gmail.com
FROM_NAME = JanDrishti AQI Updates
```

5. Click "Save Changes"
6. Your service will automatically redeploy

---

## ✅ That's It! You're Done!

### What Happens Now:

1. ✅ User clicks "Subscribe" in your app
2. ✅ Backend sends welcome email immediately
3. ✅ User receives beautiful HTML email
4. ✅ User is subscribed to daily updates

### How Users Subscribe:

**API Endpoint:**
```
POST /api/email/subscribe
```

**Request Body:**
```json
{
  "ward_no": "72",  // Optional
  "subscription_type": "aqi_updates",  // Optional
  "frequency": "daily"  // Optional
}
```

**Response:**
```json
{
  "message": "Subscribed to email updates successfully",
  "email": "user@example.com",
  "ward_no": "72"
}
```

---

## Troubleshooting

### ❌ Error: "Email service not configured"
**Solution:** Make sure all SMTP variables are in `.env` file

### ❌ Error: "Authentication failed"
**Solution:** 
- Make sure you're using **App Password**, not regular password
- Remove spaces from app password
- Verify 2-Step Verification is enabled

### ❌ Error: "Connection timeout"
**Solution:**
- Check internet connection
- Verify SMTP settings are correct
- Try different network

### ❌ Emails not received
**Solution:**
- Check spam folder
- Verify email address is correct
- Check backend logs for errors

---

## Quick Checklist

- [ ] Gmail 2-Step Verification enabled
- [ ] App Password created and copied
- [ ] `.env` file updated with email config
- [ ] Backend restarted
- [ ] Tested subscription
- [ ] Email received in inbox
- [ ] Production environment variables set (if deploying)

---

## Next Steps (Optional)

### Add Email Subscription to Frontend:

1. Update the subscribe button to call `/api/email/subscribe`
2. Show success message after subscription
3. Display subscription status

### Enable Scheduled Updates:

The backend is ready for scheduled email updates. Just enable the email scheduler in `whatsapp_scheduler.py` or create a similar email scheduler.

---

## Summary

✅ **Setup Time:** 5 minutes
✅ **Cost:** Free
✅ **Approval:** None needed
✅ **Works:** Immediately for all users
✅ **Professional:** Beautiful HTML emails

**You're all set!** Users can now subscribe and receive email notifications immediately! 🎉
