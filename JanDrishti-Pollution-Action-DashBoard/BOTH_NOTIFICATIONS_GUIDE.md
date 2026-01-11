# Complete Guide: Email + WhatsApp Notifications

## ✅ You Have Both Options Available!

Your system now supports **BOTH** Email and WhatsApp notifications:

- **📧 Email**: Works immediately (setup in 5 minutes)
- **📱 WhatsApp**: Ready for production (needs Business API approval)

---

## Quick Summary

### Email Notifications ✅
- **Status**: Ready to use NOW
- **Setup Time**: 5 minutes
- **Cost**: Free
- **Approval**: None needed

### WhatsApp Notifications ⏳
- **Status**: Code ready, waiting for approval
- **Setup Time**: 1-2 weeks (for Business API approval)
- **Cost**: Pay per message (~$0.005-0.015 per message)
- **Approval**: Required (apply now)

---

## Setup Instructions

### Step 1: Setup Email (Do This First - 5 Minutes)

**Email works immediately!**

1. **Gmail Setup:**
   - Enable 2-Step Verification: https://myaccount.google.com/security
   - Create App Password: https://myaccount.google.com/apppasswords
   - Copy 16-character password

2. **Add to `backend/.env`:**
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

✅ **Email notifications work immediately!**

---

### Step 2: Setup WhatsApp (Apply Now, Approve Later)

**WhatsApp needs Business API approval**

1. **Apply for WhatsApp Business API:**
   - Go to: https://console.twilio.com/us1/develop/sms/senders/whatsapp
   - Click "Get Started with WhatsApp"
   - Complete business verification
   - Wait for approval (1-2 weeks)

2. **After Approval:**
   - You'll get a business WhatsApp number
   - Update `backend/.env`:
     ```env
     TWILIO_WHATSAPP_FROM=whatsapp:+1YOUR_BUSINESS_NUMBER
     ```
   - Restart backend

✅ **WhatsApp notifications will work once approved!**

---

## API Endpoints

### Email Subscription

**Endpoint:** `POST /api/email/subscribe`

**Request:**
```json
{
  "email": "user@example.com",  // Optional - uses user's email
  "ward_no": "72",              // Optional
  "subscription_type": "aqi_updates",
  "frequency": "daily"
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
  "phone_number": "+919876543210",  // Optional - uses profile phone
  "ward_no": "72",
  "subscription_type": "aqi_updates",
  "frequency": "daily"
}
```

**Response:**
```json
{
  "message": "Subscribed to WhatsApp updates successfully",
  "subscription": {
    "id": "...",
    "phone_number": "+919876543210",
    "ward_no": "72",
    "is_active": true
  }
}
```

---

## Frontend Usage

### Import Services

```typescript
import { emailService, whatsappService } from '@/lib/api'
```

### Subscribe to Email

```typescript
try {
  const result = await emailService.subscribe({
    ward_no: '72'
  })
  console.log('Email subscription successful:', result)
} catch (error) {
  console.error('Email subscription failed:', error)
}
```

### Subscribe to WhatsApp

```typescript
try {
  const result = await whatsappService.subscribe({
    ward_no: '72'
  })
  console.log('WhatsApp subscription successful:', result)
} catch (error) {
  console.error('WhatsApp subscription failed:', error)
}
```

### Subscribe to Both

```typescript
const subscribeToBoth = async (wardNo: string) => {
  try {
    // Subscribe to email (always works)
    await emailService.subscribe({ ward_no: wardNo })
    
    // Subscribe to WhatsApp (if configured)
    try {
      await whatsappService.subscribe({ ward_no: wardNo })
    } catch (whatsappError) {
      // WhatsApp not configured yet - that's okay
      console.log('WhatsApp not available yet')
    }
    
    alert('Subscribed successfully!')
  } catch (error) {
    console.error('Subscription error:', error)
  }
}
```

---

## Recommendation

### For Now (Immediate Use):

1. ✅ **Use Email** - Setup email notifications (5 minutes)
2. ✅ **Enable email for all users** - Works immediately
3. ⏳ **Apply for WhatsApp Business API** - Start the approval process

### For Production:

1. ✅ **Offer Both Options** - Let users choose Email, WhatsApp, or Both
2. ✅ **Default to Email** - Most reliable, works for everyone
3. ✅ **WhatsApp as Premium** - Once approved, offer as additional option

---

## Implementation Example

### User Interface - Let Users Choose

```jsx
// Example: Subscription Modal with Options
function NotificationSubscriptionModal() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  
  const handleSubscribe = async () => {
    try {
      if (emailEnabled) {
        await emailService.subscribe({ ward_no: selectedWard })
      }
      
      if (whatsappEnabled) {
        await whatsappService.subscribe({ ward_no: selectedWard })
      }
      
      alert('Subscribed successfully!')
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }
  
  return (
    <div>
      <h3>Subscribe to Notifications</h3>
      
      <label>
        <input 
          type="checkbox" 
          checked={emailEnabled}
          onChange={(e) => setEmailEnabled(e.target.checked)}
        />
        📧 Email Notifications (Available Now)
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={whatsappEnabled}
          onChange={(e) => setWhatsappEnabled(e.target.checked)}
        />
        📱 WhatsApp Notifications {whatsappEnabled ? '(Coming Soon)' : ''}
      </label>
      
      <button onClick={handleSubscribe}>
        Subscribe
      </button>
    </div>
  )
}
```

---

## Current Status

### ✅ Email
- **Backend**: ✅ Ready
- **Frontend API**: ✅ Added to `api.ts`
- **Setup**: ⏳ Add to `.env` (5 minutes)
- **Works**: ✅ Immediately

### ✅ WhatsApp
- **Backend**: ✅ Ready
- **Frontend API**: ✅ Already exists
- **Setup**: ⏳ Apply for Business API (1-2 weeks)
- **Works**: ⏳ Once approved

---

## Next Steps

1. **Setup Email** (5 minutes)
   - Follow STEP_BY_STEP_SETUP.md
   - Add email config to `.env`
   - Test email subscription

2. **Apply for WhatsApp** (Start Now)
   - Go to Twilio Console
   - Apply for Business API
   - Wait for approval

3. **Update Frontend** (Optional)
   - Add email subscription option
   - Let users choose Email, WhatsApp, or Both
   - Show appropriate messages

---

## Summary

✅ **Both systems are ready:**
- Email works immediately (5 min setup)
- WhatsApp ready for production (needs approval)

✅ **Both endpoints are available:**
- `/api/email/subscribe` - Email notifications
- `/api/whatsapp/subscribe` - WhatsApp notifications

✅ **Users can:**
- Subscribe to email only (works now)
- Subscribe to WhatsApp only (after approval)
- Subscribe to both

**You have everything you need!** 🎉
