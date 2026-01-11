# Dual Notification Setup: Email + WhatsApp

## ✅ Support Both Email AND WhatsApp Notifications

Your system now supports **both** email and WhatsApp notifications:

- **Email**: Works immediately (setup in 5 minutes)
- **WhatsApp**: Works once you get Business API approval (takes 1-2 weeks)

Users can subscribe to either or both!

---

## How It Works

### Current Setup:

1. **Email Subscriptions** (`/api/email/subscribe`)
   - ✅ Works immediately
   - ✅ No approval needed
   - ✅ Setup in 5 minutes (see STEP_BY_STEP_SETUP.md)

2. **WhatsApp Subscriptions** (`/api/whatsapp/subscribe`)
   - ⏳ Requires Business API approval (1-2 weeks)
   - ✅ Code is ready
   - ✅ Will work once you get approved number

---

## Setup Guide

### Part 1: Email Setup (Immediate - Do This First)

**Time: 5 minutes**

1. **Gmail Setup:**
   - Enable 2-Step Verification: https://myaccount.google.com/security
   - Create App Password: https://myaccount.google.com/apppasswords
   - Copy 16-character password

2. **Add to `.env`:**
   ```env
   # Email Configuration
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=JanDrishti AQI Updates
   ```

3. **Restart backend**

**✅ Email notifications now work immediately!**

---

### Part 2: WhatsApp Setup (For Later)

**Time: 1-2 weeks for approval**

1. **Apply for WhatsApp Business API:**
   - Go to: https://console.twilio.com/us1/develop/sms/senders/whatsapp
   - Click "Get Started with WhatsApp"
   - Complete business verification
   - Wait for approval (1-2 weeks)

2. **After Approval:**
   - Update `.env`:
     ```env
     TWILIO_WHATSAPP_FROM=whatsapp:+1YOUR_BUSINESS_NUMBER
     ```
   - Restart backend

**✅ WhatsApp notifications will work once approved!**

---

## API Endpoints

### Email Subscription

**Endpoint:** `POST /api/email/subscribe`

**Request:**
```json
{
  "email": "user@example.com",  // Optional - uses user's email if not provided
  "ward_no": "72",              // Optional
  "subscription_type": "aqi_updates",  // Optional
  "frequency": "daily"          // Optional
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

### WhatsApp Subscription

**Endpoint:** `POST /api/whatsapp/subscribe`

**Request:**
```json
{
  "phone_number": "+919876543210",  // Optional - uses profile phone if not provided
  "ward_no": "72",                  // Optional
  "subscription_type": "aqi_updates",  // Optional
  "frequency": "daily"              // Optional
}
```

**Response:**
```json
{
  "message": "Subscribed to WhatsApp updates successfully",
  "subscription": {
    "id": "...",
    "user_id": "...",
    "phone_number": "+919876543210",
    "ward_no": "72",
    "is_active": true
  }
}
```

---

## Frontend Integration

You can update your frontend to support both:

### Option 1: Separate Buttons

```jsx
// Email subscription button
<Button onClick={() => subscribeToEmail()}>
  Subscribe to Email Updates
</Button>

// WhatsApp subscription button
<Button onClick={() => subscribeToWhatsApp()}>
  Subscribe to WhatsApp Updates
</Button>
```

### Option 2: Combined Subscription

```jsx
// Let users choose notification method
<Select>
  <Option value="email">Email</Option>
  <Option value="whatsapp">WhatsApp</Option>
  <Option value="both">Both</Option>
</Select>

<Button onClick={() => subscribe(chosenMethod)}>
  Subscribe
</Button>
```

### Option 3: Checkbox Options

```jsx
<Checkbox value="email">Email notifications</Checkbox>
<Checkbox value="whatsapp">WhatsApp notifications</Checkbox>
<Button onClick={() => subscribe(selectedOptions)}>
  Subscribe
</Button>
```

---

## Implementation Example

### Subscribe to Both

```javascript
// Frontend code
const subscribeToBoth = async () => {
  try {
    // Subscribe to email
    await fetch('/api/email/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ward_no: selectedWard
      })
    });
    
    // Subscribe to WhatsApp (if configured)
    await fetch('/api/whatsapp/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ward_no: selectedWard
      })
    });
    
    alert('Subscribed to both email and WhatsApp!');
  } catch (error) {
    console.error('Subscription error:', error);
  }
};
```

---

## Current Status

### ✅ Email Notifications
- **Status:** Ready to use
- **Setup:** 5 minutes
- **Works:** Immediately for all users

### ⏳ WhatsApp Notifications
- **Status:** Code ready, waiting for Business API approval
- **Setup:** 1-2 weeks for approval
- **Works:** Once you get approved number

---

## Testing

### Test Email:
```bash
curl -X POST http://localhost:8000/api/email/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ward_no": "72"}'
```

### Test WhatsApp (if configured):
```bash
curl -X POST http://localhost:8000/api/whatsapp/subscribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ward_no": "72"}'
```

---

## Recommendations

### For Now (Immediate):
1. ✅ **Use Email** - Works immediately
2. ⏳ **Apply for WhatsApp Business API** - Start the approval process

### For Production:
1. ✅ **Offer Both Options** - Let users choose
2. ✅ **Default to Email** - Most reliable
3. ✅ **WhatsApp as Premium Option** - Once approved

---

## Summary

✅ **Both endpoints are ready:**
- `/api/email/subscribe` - Works immediately
- `/api/whatsapp/subscribe` - Works after approval

✅ **Setup:**
- Email: 5 minutes (see STEP_BY_STEP_SETUP.md)
- WhatsApp: Apply now, approve in 1-2 weeks

✅ **Users can:**
- Subscribe to email only
- Subscribe to WhatsApp only
- Subscribe to both

**You're all set!** Email works now, WhatsApp will work once approved! 🎉
