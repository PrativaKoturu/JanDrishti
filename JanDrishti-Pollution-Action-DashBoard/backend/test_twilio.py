"""
Test Twilio WhatsApp Configuration
Run this script to verify your Twilio setup
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from twilio_service import get_twilio_service

def test_twilio_config():
    """Test Twilio configuration and send a test message"""
    
    print("=" * 60)
    print("Twilio WhatsApp Configuration Test")
    print("=" * 60)
    print()
    
    # Check environment variables
    print("1. Checking Environment Variables...")
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")
    
    if account_sid:
        print(f"   ✅ TWILIO_ACCOUNT_SID: {account_sid[:10]}...{account_sid[-4:]}")
    else:
        print("   ❌ TWILIO_ACCOUNT_SID: Not set")
        return False
    
    if auth_token:
        print(f"   ✅ TWILIO_AUTH_TOKEN: {'*' * 20}...{auth_token[-4:]}")
    else:
        print("   ❌ TWILIO_AUTH_TOKEN: Not set")
        return False
    
    if whatsapp_from:
        print(f"   ✅ TWILIO_WHATSAPP_FROM: {whatsapp_from}")
        if not whatsapp_from.startswith("whatsapp:+"):
            print("   ⚠️  WARNING: Format should be 'whatsapp:+14155238886'")
    else:
        print("   ❌ TWILIO_WHATSAPP_FROM: Not set")
        return False
    
    print()
    
    # Initialize Twilio service
    print("2. Initializing Twilio Service...")
    twilio_service = get_twilio_service()
    
    if not twilio_service.is_configured():
        print("   ❌ Twilio service not configured")
        return False
    
    print("   ✅ Twilio service initialized successfully")
    print()
    
    # Test phone number formatting
    print("3. Testing Phone Number Formatting...")
    test_numbers = [
        "9167285340",
        "+919167285340",
        "919167285340",
        "+91 91672 85340"
    ]
    
    for phone in test_numbers:
        formatted = twilio_service.format_phone_number(phone)
        print(f"   {phone:20} → {formatted}")
    
    print()
    
    # Prompt for test message
    print("4. Send Test Message?")
    response = input("   Do you want to send a test message? (y/n): ").strip().lower()
    
    if response == 'y':
        phone = input("   Enter phone number to test (e.g., +919167285340): ").strip()
        
        if not phone:
            print("   ❌ Phone number is required")
            return False
        
        test_message = "🧪 Test message from JanDrishti\n\nThis is a test to verify your Twilio WhatsApp setup is working correctly.\n\nIf you receive this message, your setup is correct! ✅"
        
        print(f"\n   Sending test message to {phone}...")
        result = twilio_service.send_message(phone, test_message)
        
        if result.get("success"):
            print(f"   ✅ Message sent successfully!")
            print(f"   Message SID: {result.get('message_sid')}")
            print(f"   Status: {result.get('status')}")
            print(f"\n   📱 Check the recipient's WhatsApp for the message")
            print(f"   📊 Check Twilio Console for delivery status:")
            print(f"      https://console.twilio.com/us1/monitor/logs/messaging")
            print(f"\n   ⚠️  IMPORTANT: If recipient hasn't joined Twilio Sandbox,")
            print(f"      they won't receive the message. See TWILIO_SANDBOX_GUIDE.md")
        else:
            print(f"   ❌ Failed to send message")
            print(f"   Error: {result.get('error')}")
            if result.get('code'):
                print(f"   Error Code: {result.get('code')}")
            return False
    else:
        print("   Skipped test message")
    
    print()
    print("=" * 60)
    print("Test Complete!")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    try:
        success = test_twilio_config()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
