# Auto Sandbox Configuration Guide

## ✅ Automatic Sandbox Join Instructions

When users subscribe to WhatsApp notifications, they now **automatically receive email instructions** to join the Twilio sandbox!

---

## How It Works

### 1. User Clicks Subscribe
- User subscribes to WhatsApp notifications via your app
- Backend tries to send WhatsApp welcome message

### 2. Automatic Detection
- If WhatsApp message **succeeds** → User is already in sandbox ✅
- If WhatsApp message **fails** → User is NOT in sandbox ⚠️

### 3. Auto-Send Instructions
- If message failed (user not in sandbox):
  - Backend automatically detects this
  - Sends email with **WhatsApp join link** (one-click setup!)
  - User clicks link → WhatsApp opens with pre-filled message
  - User taps "Send" → Done! ✅

---

## Setup Instructions

### Step 1: Get Your Sandbox Join Code

1. Go to **Twilio Console**: https://console.twilio.com/
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. You'll see your sandbox number and join code
4. The join code looks like: `join older-talk` (yours might be different)
5. **Copy this code** - you'll need it in Step 2

### Step 2: Add to .env File

Add this to your `backend/.env` file:

```env
# Twilio Sandbox Join Code
TWILIO_SANDBOX_JOIN_CODE=join older-talk
```

**Important:** 
- Replace `join older-talk` with your actual join code from Twilio Console
- If you don't set this, it defaults to `join older-talk`

### Step 3: Enable Email Service

Make sure email service is configured (for sending instructions):

```env
# Email Configuration (Required for auto-sandbox setup)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=JanDrishti AQI Updates
```

### Step 4: Restart Backend

```bash
# Stop and restart your backend
cd backend
python main.py
```

---

## How Users Experience It

### Scenario 1: User Already in Sandbox ✅

1. User clicks "Subscribe to WhatsApp"
2. Welcome message sent successfully
3. User receives WhatsApp message immediately
4. Done!

### Scenario 2: User NOT in Sandbox (Most Common) 📧

1. User clicks "Subscribe to WhatsApp"
2. Backend tries to send WhatsApp message (fails - user not in sandbox)
3. **Automatically sends email** with:
   - WhatsApp join link (one-click!)
   - Clear instructions
   - Step-by-step guide
4. User clicks link in email
5. WhatsApp opens with pre-filled message: "join older-talk"
6. User taps "Send"
7. User receives confirmation from Twilio
8. **Now user is in sandbox!** ✅
9. Next notification will work via WhatsApp

---

## Email Template Features

The auto-sent email includes:

✅ **One-Click Join Link** - Opens WhatsApp with pre-filled message
✅ **Visual Instructions** - Clear, step-by-step guide
✅ **Alternative Method** - Manual setup instructions
✅ **Beautiful HTML Design** - Professional email template

---

## Example Email Users Receive

**Subject:** 📱 Complete Your WhatsApp Subscription Setup

**Content:**
- ✅ Subscription created confirmation
- 📱 Quick setup button (click to join)
- 📝 Manual setup instructions (alternative)
- ⏱️ One-time setup reminder

---

## Configuration Options

### Customize Join Code

In `.env`:
```env
TWILIO_SANDBOX_JOIN_CODE=join your-custom-code
```

### Default Behavior

If `TWILIO_SANDBOX_JOIN_CODE` is not set:
- Defaults to: `join older-talk`
- This might not match your sandbox - **always set it!**

### Email Required

**Important:** Email service must be configured for auto-sandbox setup to work.

If email is not configured:
- WhatsApp subscription will still work
- But users won't get automatic join instructions
- They'll need to manually join the sandbox

---

## Testing

### Test Auto-Sandbox Setup

1. **Make sure user is NOT in sandbox:**
   - Use a phone number that hasn't joined your sandbox

2. **Subscribe to WhatsApp:**
   ```bash
   POST /api/whatsapp/subscribe
   {
     "ward_no": "72"
   }
   ```

3. **Check email inbox:**
   - User should receive email with join instructions
   - Email contains WhatsApp join link

4. **Click the link:**
   - Should open WhatsApp
   - Message should be pre-filled
   - Tap "Send"
   - Should receive confirmation

5. **Test WhatsApp again:**
   - Now user should receive WhatsApp messages!

---

## Troubleshooting

### Issue: Users not receiving email instructions

**Check:**
1. ✅ Email service is configured in `.env`
2. ✅ `SMTP_EMAIL` and `SMTP_PASSWORD` are correct
3. ✅ User's email address is in profile
4. ✅ Check backend logs for email errors

### Issue: WhatsApp link not working

**Check:**
1. ✅ `TWILIO_SANDBOX_JOIN_CODE` is set correctly
2. ✅ Join code matches your Twilio Console
3. ✅ Link opens WhatsApp (not browser)
4. ✅ User has WhatsApp installed on phone

### Issue: Pre-filled message is wrong

**Solution:**
- Update `TWILIO_SANDBOX_JOIN_CODE` in `.env`
- Make sure it matches your Twilio Console exactly
- Include "join" prefix if your code needs it

---

## Benefits

✅ **Automatic** - No manual instruction needed
✅ **User-Friendly** - One-click join link
✅ **Professional** - Beautiful email template
✅ **Efficient** - Saves support time
✅ **Reliable** - Works for all users

---

## Summary

**Before:**
- Users had to manually join sandbox
- Required support instructions
- Many users didn't complete setup

**After:**
- ✅ Automatic email with join instructions
- ✅ One-click WhatsApp link
- ✅ Professional email template
- ✅ Higher completion rate

**Setup Time:** 2 minutes (just add join code to `.env`)

**Result:** Users automatically get instructions to join sandbox! 🎉
