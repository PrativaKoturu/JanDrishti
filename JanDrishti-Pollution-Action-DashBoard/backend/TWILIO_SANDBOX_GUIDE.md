# Twilio WhatsApp Sandbox Setup Guide

## ⚠️ Important: Sandbox Limitation

**When using Twilio Sandbox, you can ONLY send messages to phone numbers that have explicitly joined the sandbox!**

## Current Status

✅ **Your setup is correct:**
- Account SID and Auth Token are configured
- Message was sent successfully (SID: SM61791871a6f9c446b6cc1fd2e9428313)
- Phone number format is correct: `+919167285340`

## The Problem

The recipient phone number (`+919167285340`) **must join the Twilio Sandbox first** before receiving messages.

## How to Join Twilio Sandbox

### Step 1: Get Your Sandbox Join Code

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. You'll see a sandbox number (usually `+1 415 523 8886`) and a join code
4. The join code format is: `join [code]` (e.g., `join older-talk`)

### Step 2: Send Join Code from Recipient's WhatsApp

1. Open WhatsApp on the phone number: **+91 91672 85340**
2. Send a message to the Twilio Sandbox number: **+1 415 523 8886**
3. Send the join code (e.g., `join older-talk`)
4. You should receive a confirmation message: "You are all set! The sandbox can now send/receive messages..."

### Step 3: Test Again

After joining the sandbox:
1. Try subscribing again from your app
2. The welcome message should be received

## Verify Your Setup

### Check Environment Variables

In your `.env` file, make sure you have:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Important:** `TWILIO_WHATSAPP_FROM` must be in format: `whatsapp:+14155238886`

### Check Message Status in Twilio Console

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor** → **Logs** → **Messaging**
3. Find your message SID: `SM61791871a6f9c446b6cc1fd2e9428313`
4. Check the **Status** field:
   - `sent` = Message sent but not delivered (recipient not in sandbox)
   - `delivered` = Message delivered successfully
   - `failed` = Delivery failed (check error message)

## Common Issues

### Issue 1: Message shows "sent" but not "delivered"

**Cause:** Recipient phone number hasn't joined the sandbox

**Solution:** Have the recipient join the sandbox (see Step 2 above)

### Issue 2: No message received after joining sandbox

**Possible causes:**
1. Wrong phone number format
2. Phone number not verified in WhatsApp
3. Delay in Twilio's system (wait a few minutes)

**Solution:**
- Verify phone number format: Must be `+919167285340` (with country code)
- Make sure WhatsApp is active on that number
- Check Twilio logs for delivery status

### Issue 3: Error "Invalid phone number"

**Cause:** Phone number format is incorrect

**Solution:**
- Ensure format is: `+919167285340` (E.164 format)
- Don't use spaces or dashes
- Must include country code (+91 for India)

## Testing Your Setup

### Test 1: Send Test Message

Run this Python script to test:

```python
from twilio_service import get_twilio_service

twilio = get_twilio_service()
result = twilio.send_message("+919167285340", "Test message from JanDrishti")
print(result)
```

### Test 2: Check Twilio Logs

1. Go to Twilio Console → Monitor → Logs → Messaging
2. Look for recent messages
3. Check status and error messages

## Production Setup (Moving Beyond Sandbox)

To send messages to any phone number (not just sandbox members):

1. **Apply for Twilio WhatsApp Business API**
   - Go to Twilio Console → Messaging → Senders → WhatsApp
   - Click "Get Started with WhatsApp"
   - Complete the business verification process

2. **Wait for Approval**
   - Business verification can take 1-2 weeks
   - You'll need business documents

3. **Update Environment Variables**
   - Once approved, you'll get a business WhatsApp number
   - Update `TWILIO_WHATSAPP_FROM` with your business number

## Quick Checklist

- [ ] Recipient phone number has joined Twilio Sandbox
- [ ] Join code sent from recipient's WhatsApp
- [ ] Confirmation message received in recipient's WhatsApp
- [ ] `TWILIO_WHATSAPP_FROM` is set correctly (format: `whatsapp:+14155238886`)
- [ ] Phone number format is correct (E.164: `+919167285340`)
- [ ] Checked Twilio Console logs for message status

## Next Steps

1. **For Testing:** Have all test phone numbers join the sandbox
2. **For Production:** Apply for Twilio WhatsApp Business API
3. **For Now:** Test with phone numbers that have joined the sandbox

## Need Help?

- Check Twilio logs: https://console.twilio.com/us1/monitor/logs
- Twilio WhatsApp Docs: https://www.twilio.com/docs/whatsapp
- Twilio Support: https://support.twilio.com/
