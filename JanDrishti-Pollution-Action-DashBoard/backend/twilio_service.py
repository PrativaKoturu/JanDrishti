"""
Twilio WhatsApp Service
Handles sending WhatsApp messages via Twilio API
"""
import os
from typing import Optional, Dict, List
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class TwilioWhatsAppService:
    def __init__(self):
        """Initialize Twilio client"""
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")  # Format: whatsapp:+14155238886
        
        if not all([self.account_sid, self.auth_token, self.whatsapp_from]):
            logger.warning("Twilio credentials not fully configured. WhatsApp service will be disabled.")
            self.client = None
        else:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio WhatsApp service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")
                self.client = None
    
    def is_configured(self) -> bool:
        """Check if Twilio is properly configured"""
        return self.client is not None
    
    def format_phone_number(self, phone: str) -> str:
        """
        Format phone number for WhatsApp (E.164 format)
        Example: +919876543210
        """
        # Remove all non-digit characters
        digits = ''.join(filter(str.isdigit, phone))
        
        # If doesn't start with +, assume Indian number and add +91
        if not phone.startswith('+'):
            if len(digits) == 10:
                return f"+91{digits}"
            elif len(digits) == 12 and digits.startswith('91'):
                return f"+{digits}"
            else:
                return f"+{digits}"
        
        return phone
    
    def send_message(self, to_phone: str, message: str) -> Dict[str, any]:
        """
        Send WhatsApp message via Twilio
        
        Args:
            to_phone: Recipient phone number (will be formatted)
            message: Message content
            
        Returns:
            Dict with success status and message details
        """
        if not self.is_configured():
            return {
                "success": False,
                "error": "Twilio service not configured"
            }
        
        try:
            formatted_to = self.format_phone_number(to_phone)
            whatsapp_to = f"whatsapp:{formatted_to}"
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.whatsapp_from,
                to=whatsapp_to
            )
            
            logger.info(f"WhatsApp message sent successfully. SID: {message_obj.sid}")
            
            return {
                "success": True,
                "message_sid": message_obj.sid,
                "status": message_obj.status,
                "to": formatted_to
            }
            
        except TwilioRestException as e:
            logger.error(f"Twilio API error: {e}")
            return {
                "success": False,
                "error": str(e),
                "code": e.code
            }
        except Exception as e:
            logger.error(f"Unexpected error sending WhatsApp message: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_aqi_update(self, phone: str, aqi_data: Dict, ward_name: str) -> Dict[str, any]:
        """
        Send formatted AQI update message
        
        Args:
            phone: Recipient phone number
            aqi_data: Dictionary with AQI data
            ward_name: Name of the ward
        """
        aqi_value = aqi_data.get('aqi', 0)
        pm25 = aqi_data.get('pm25', 0)
        pm10 = aqi_data.get('pm10', 0)
        
        # Determine AQI status
        if aqi_value <= 50:
            status = "Good ✅"
            emoji = "🟢"
            advice = "Air quality is satisfactory. Enjoy outdoor activities!"
        elif aqi_value <= 100:
            status = "Moderate ⚠️"
            emoji = "🟡"
            advice = "Air quality is acceptable. Sensitive individuals may experience minor breathing discomfort."
        elif aqi_value <= 150:
            status = "Unhealthy for Sensitive Groups 🟠"
            emoji = "🟠"
            advice = "Children, elderly, and people with respiratory issues should avoid prolonged outdoor activities."
        elif aqi_value <= 200:
            status = "Unhealthy 🔴"
            emoji = "🔴"
            advice = "Everyone may experience health effects. Avoid outdoor activities. Use N95 masks if going out."
        elif aqi_value <= 300:
            status = "Very Unhealthy 🟣"
            emoji = "🟣"
            advice = "Health alert: Everyone may experience serious health effects. Stay indoors. Use air purifiers."
        else:
            status = "Hazardous ⚫"
            emoji = "⚫"
            advice = "Emergency conditions: Avoid all outdoor activities. Keep windows closed. Use air purifiers."
        
        message = f"""🌍 *JanDrishti AQI Update*

📍 *Location:* {ward_name}
{emoji} *AQI:* {aqi_value} - {status}

📊 *Pollutant Levels:*
• PM2.5: {pm25:.1f} µg/m³
• PM10: {pm10:.1f} µg/m³

💡 *Health Advice:*
{advice}

🛡️ *Precautions:*
• Keep windows closed if AQI > 150
• Use N95 masks when going out
• Avoid outdoor exercise
• Use air purifiers indoors
• Stay hydrated

📱 Stay informed with JanDrishti
For more details, visit: jandrishti.in"""
        
        return self.send_message(phone, message)
    
    def send_precautions_update(self, phone: str, aqi_value: int, ward_name: str) -> Dict[str, any]:
        """
        Send precautions update based on AQI level
        """
        if aqi_value <= 100:
            precautions = """✅ *Current Air Quality is Safe*

You can:
• Enjoy outdoor activities
• Open windows for ventilation
• Exercise outdoors
• No special precautions needed"""
        elif aqi_value <= 150:
            precautions = """⚠️ *Moderate Air Quality*

Precautions:
• Sensitive groups should limit outdoor activities
• Keep windows slightly open
• Monitor air quality regularly
• Consider using air purifiers"""
        elif aqi_value <= 200:
            precautions = """🔴 *Unhealthy Air Quality*

Precautions:
• Avoid outdoor activities
• Keep windows closed
• Use N95 masks if going out
• Use air purifiers indoors
• Children and elderly stay indoors"""
        elif aqi_value <= 300:
            precautions = """🟣 *Very Unhealthy Air Quality*

Critical Precautions:
• Stay indoors at all times
• Keep all windows and doors closed
• Use air purifiers with HEPA filters
• Wear N95 masks if you must go out
• Avoid physical exertion
• Monitor health symptoms"""
        else:
            precautions = """⚫ *Hazardous Air Quality - EMERGENCY*

Emergency Precautions:
• DO NOT go outside
• Keep all windows and doors sealed
• Use air purifiers in all rooms
• If you must go out, use N99 masks
• Seek medical help if experiencing breathing difficulties
• Call emergency helpline: 108"""
        
        message = f"""🛡️ *JanDrishti Safety Precautions*

📍 *Location:* {ward_name}
📊 *Current AQI:* {aqi_value}

{precautions}

📞 *Emergency Helplines:*
• Health Emergency: 108
• Pollution Control: 1800-11-0031
• Municipal Corp: 1800-11-3344

Stay safe! 🌱"""
        
        return self.send_message(phone, message)

# Singleton instance
_twilio_service = None

def get_twilio_service() -> TwilioWhatsAppService:
    """Get singleton Twilio service instance"""
    global _twilio_service
    if _twilio_service is None:
        _twilio_service = TwilioWhatsAppService()
    return _twilio_service
