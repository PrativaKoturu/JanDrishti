"""
Auto Sandbox Configuration Helper
Automatically helps users join Twilio WhatsApp Sandbox
"""
import os
import logging
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class SandboxHelper:
    def __init__(self):
        """Initialize sandbox helper"""
        self.sandbox_number = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
        # Extract phone number from whatsapp: format
        if "whatsapp:" in self.sandbox_number:
            self.sandbox_phone = self.sandbox_number.replace("whatsapp:", "")
        else:
            self.sandbox_phone = "+14155238886"
        
        # Get join code from environment or use default
        # Default format: "join [code]" where code is usually something like "older-talk"
        # You need to get this from your Twilio Console
        self.join_code = os.getenv("TWILIO_SANDBOX_JOIN_CODE", "join older-talk")
        
    def get_whatsapp_join_link(self) -> str:
        """
        Generate WhatsApp deep link for joining sandbox
        Format: https://wa.me/PHONE?text=MESSAGE
        """
        message = self.join_code
        # URL encode the message
        encoded_message = message.replace(" ", "%20")
        link = f"https://wa.me/{self.sandbox_phone.replace('+', '')}?text={encoded_message}"
        return link
    
    def get_join_instructions_html(self, user_email: str) -> str:
        """Generate HTML instructions for joining sandbox"""
        join_link = self.get_whatsapp_join_link()
        
        html = f"""
        <div style="background: #f0f9ff; border-left: 5px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #1e40af;">📱 Complete WhatsApp Setup</h3>
            <p style="color: #1e3a8a; margin-bottom: 15px;">
                To receive WhatsApp notifications, you need to join our WhatsApp sandbox. This takes just 30 seconds!
            </p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">Quick Setup (Recommended):</p>
                <a href="{join_link}" 
                   style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold; margin-bottom: 15px;">
                    📱 Click to Join WhatsApp Sandbox
                </a>
                <p style="font-size: 12px; color: #6b7280; margin: 10px 0 0 0;">
                    This will open WhatsApp with a pre-filled message. Just tap "Send"!
                </p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">Manual Setup (Alternative):</p>
                <ol style="margin: 0; padding-left: 20px; color: #374151;">
                    <li style="margin-bottom: 8px;">Open WhatsApp on your phone</li>
                    <li style="margin-bottom: 8px;">Send a message to: <strong>{self.sandbox_phone}</strong></li>
                    <li style="margin-bottom: 8px;">Send this code: <strong>{self.join_code}</strong></li>
                    <li>You'll receive a confirmation message</li>
                </ol>
            </div>
            
            <p style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                ⏱️ This is a one-time setup. Once you join, you'll receive all WhatsApp notifications automatically.
            </p>
        </div>
        """
        
        return html
    
    def get_join_instructions_text(self) -> str:
        """Generate plain text instructions for joining sandbox"""
        join_link = self.get_whatsapp_join_link()
        
        text = f"""
📱 Complete WhatsApp Setup

To receive WhatsApp notifications, you need to join our WhatsApp sandbox. This takes just 30 seconds!

QUICK SETUP (Recommended):
👉 Click this link: {join_link}
This will open WhatsApp with a pre-filled message. Just tap "Send"!

MANUAL SETUP (Alternative):
1. Open WhatsApp on your phone
2. Send a message to: {self.sandbox_phone}
3. Send this code: {self.join_code}
4. You'll receive a confirmation message

⏱️ This is a one-time setup. Once you join, you'll receive all WhatsApp notifications automatically.
        """
        
        return text

# Singleton instance
_sandbox_helper = None

def get_sandbox_helper() -> SandboxHelper:
    """Get singleton sandbox helper instance"""
    global _sandbox_helper
    if _sandbox_helper is None:
        _sandbox_helper = SandboxHelper()
    return _sandbox_helper
