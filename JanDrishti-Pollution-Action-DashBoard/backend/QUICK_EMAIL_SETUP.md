# Quick Email Notification Setup Guide

## ✅ Immediate Solution - No Approval Needed!

This setup takes **5 minutes** and works immediately for all users.

---

## Step 1: Choose Your Email Provider

### Option A: Gmail (Recommended - Easiest)

1. **Use your Gmail account** (or create a new one for notifications)
2. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
   
3. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter: "JanDrishti"
   - Click "Generate"
   - **Copy the 16-character password** (save it - you'll use this as SMTP_PASSWORD)

### Option B: Other Email Providers

- **Outlook/Hotmail:** Use SMTP settings for Outlook
- **Yahoo:** Use Yahoo SMTP settings
- **Custom SMTP:** Use your domain's SMTP server

---

## Step 2: Update .env File

Add these lines to your `backend/.env` file:

```env
# Email Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=JanDrishti AQI Updates
```

**Important:**
- For Gmail: Use the **App Password** (16 characters), NOT your regular password
- Replace `your-email@gmail.com` with your actual Gmail address
- Keep quotes if your password has special characters

---

## Step 3: Install Dependencies (Already Done!)

Email service uses Python's built-in `smtplib` - no extra packages needed! ✅

---

## Step 4: Test the Setup

Run this test script:

```bash
cd backend
python -c "
from email_service import get_email_service
service = get_email_service()
result = service.send_welcome_email('your-test-email@gmail.com', 'Ward 72')
print('Success!' if result.get('success') else f\"Error: {result.get('error')}\")
"
```

**Or test manually:**
1. Start your backend server
2. Subscribe to notifications from your app
3. Check your email inbox!

---

## Step 5: Deploy to Production

**For Render/Production:**

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=JanDrishti AQI Updates
   ```
5. Redeploy your service

---

## How It Works

1. **User clicks "Subscribe"** in your app
2. **Backend sends welcome email** immediately
3. **User receives email** with AQI updates
4. **Daily updates** are sent via email (if you enable scheduler)

---

## Email Provider Settings

### Gmail (Recommended)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### Yahoo
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_EMAIL=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

### Custom SMTP
```env
SMTP_SERVER=mail.yourdomain.com
SMTP_PORT=587
SMTP_EMAIL=noreply@yourdomain.com
SMTP_PASSWORD=your-password
```

---

## Troubleshooting

### Error: "Authentication failed"

**Gmail:**
- Make sure you're using **App Password**, not regular password
- Ensure 2-Step Verification is enabled
- Check that App Password is correct (16 characters, no spaces)

**Other providers:**
- Check username/password
- Try enabling "Less secure app access" (if available)

### Error: "Connection timeout"

- Check your firewall settings
- Verify SMTP server and port are correct
- Try port 465 with SSL (requires code change)

### Emails not received

- Check spam folder
- Verify recipient email is correct
- Check backend logs for errors

---

## Advantages of Email Notifications

✅ **Works immediately** - No approval needed
✅ **Free** - No cost for sending emails
✅ **Universal** - Everyone has email
✅ **Professional** - HTML emails look great
✅ **Reliable** - High delivery rates
✅ **Easy to manage** - Users can filter/organize

---

## Next Steps

1. ✅ Complete setup (5 minutes)
2. ✅ Test with your email
3. ✅ Deploy to production
4. ✅ Users can now subscribe and receive emails!

**That's it!** Users will receive beautiful HTML emails with AQI updates. 🎉
