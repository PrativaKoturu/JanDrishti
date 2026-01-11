"""
Email Notification Service
Sends AQI updates and precautions via email
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Optional
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        """Initialize email service"""
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_email = os.getenv("SMTP_EMAIL")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_email)
        self.from_name = os.getenv("FROM_NAME", "JanDrishti AQI Updates")
        
        self.is_configured = bool(self.smtp_email and self.smtp_password)
        
        if not self.is_configured:
            logger.warning("Email service not configured. Set SMTP_EMAIL and SMTP_PASSWORD in .env")
    
    def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None) -> Dict[str, any]:
        """
        Send email
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text email body (optional)
            
        Returns:
            Dict with success status
        """
        if not self.is_configured:
            return {
                "success": False,
                "error": "Email service not configured"
            }
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            # Add text and HTML parts
            if text_content:
                part1 = MIMEText(text_content, 'plain')
                msg.attach(part1)
            
            part2 = MIMEText(html_content, 'html')
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_email, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return {
                "success": True,
                "to": to_email
            }
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_aqi_update(self, to_email: str, aqi_data: Dict, ward_name: str) -> Dict[str, any]:
        """
        Send AQI update email
        """
        aqi_value = aqi_data.get('aqi', 0)
        pm25 = aqi_data.get('pm25', 0)
        pm10 = aqi_data.get('pm10', 0)
        
        # Determine AQI status
        if aqi_value <= 50:
            status = "Good ✅"
            emoji = "🟢"
            color = "#22c55e"
            advice = "Air quality is satisfactory. Enjoy outdoor activities!"
        elif aqi_value <= 100:
            status = "Moderate ⚠️"
            emoji = "🟡"
            color = "#eab308"
            advice = "Air quality is acceptable. Sensitive individuals may experience minor breathing discomfort."
        elif aqi_value <= 150:
            status = "Unhealthy for Sensitive Groups 🟠"
            emoji = "🟠"
            color = "#f97316"
            advice = "Children, elderly, and people with respiratory issues should avoid prolonged outdoor activities."
        elif aqi_value <= 200:
            status = "Unhealthy 🔴"
            emoji = "🔴"
            color = "#ef4444"
            advice = "Everyone may experience health effects. Avoid outdoor activities. Use N95 masks if going out."
        elif aqi_value <= 300:
            status = "Very Unhealthy 🟣"
            emoji = "🟣"
            color = "#a855f7"
            advice = "Health alert: Everyone may experience serious health effects. Stay indoors. Use air purifiers."
        else:
            status = "Hazardous ⚫"
            emoji = "⚫"
            color = "#52525b"
            advice = "Emergency conditions: Avoid all outdoor activities. Keep windows closed. Use air purifiers."
        
        subject = f"{emoji} AQI Update: {ward_name} - {aqi_value} ({status.split()[0]})"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .aqi-box {{ background: white; border-left: 5px solid {color}; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .aqi-value {{ font-size: 48px; font-weight: bold; color: {color}; margin: 10px 0; }}
                .status {{ font-size: 20px; color: {color}; margin: 10px 0; }}
                .info-box {{ background: white; padding: 20px; margin: 15px 0; border-radius: 5px; }}
                .info-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }}
                .info-row:last-child {{ border-bottom: none; }}
                .advice-box {{ background: #fef3c7; border-left: 5px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .precautions {{ background: #eff6ff; border-left: 5px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }}
                ul {{ padding-left: 20px; }}
                li {{ margin: 8px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌍 JanDrishti AQI Update</h1>
                    <p>Air Quality Index Report</p>
                </div>
                
                <div class="content">
                    <div class="aqi-box">
                        <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">📍 Location</div>
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">{ward_name}</div>
                        
                        <div class="aqi-value">{aqi_value}</div>
                        <div class="status">{status}</div>
                    </div>
                    
                    <div class="info-box">
                        <h3 style="margin-top: 0;">📊 Pollutant Levels</h3>
                        <div class="info-row">
                            <span>PM2.5:</span>
                            <span><strong>{pm25:.1f} µg/m³</strong></span>
                        </div>
                        <div class="info-row">
                            <span>PM10:</span>
                            <span><strong>{pm10:.1f} µg/m³</strong></span>
                        </div>
                    </div>
                    
                    <div class="advice-box">
                        <h3 style="margin-top: 0;">💡 Health Advice</h3>
                        <p>{advice}</p>
                    </div>
                    
                    <div class="precautions">
                        <h3 style="margin-top: 0;">🛡️ Precautions</h3>
                        <ul>
                            <li>Keep windows closed if AQI > 150</li>
                            <li>Use N95 masks when going out</li>
                            <li>Avoid outdoor exercise</li>
                            <li>Use air purifiers indoors</li>
                            <li>Stay hydrated</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>📱 Stay informed with JanDrishti</p>
                    <p>Visit <a href="https://jandrishti.in">jandrishti.in</a> for more details</p>
                    <p>To unsubscribe from these updates, please log in to your account</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
🌍 JanDrishti AQI Update

📍 Location: {ward_name}
{emoji} AQI: {aqi_value} - {status}

📊 Pollutant Levels:
• PM2.5: {pm25:.1f} µg/m³
• PM10: {pm10:.1f} µg/m³

💡 Health Advice:
{advice}

🛡️ Precautions:
• Keep windows closed if AQI > 150
• Use N95 masks when going out
• Avoid outdoor exercise
• Use air purifiers indoors
• Stay hydrated

📱 Stay informed with JanDrishti
Visit jandrishti.in for more details

To unsubscribe, log in to your account
        """
        
        return self.send_email(to_email, subject, html_content, text_content)
    
    def send_welcome_email(self, to_email: str, ward_no: Optional[str] = None) -> Dict[str, any]:
        """Send welcome email after subscription"""
        subject = "🌍 Welcome to JanDrishti AQI Updates!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .success-box {{ background: #d1fae5; border-left: 5px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; }}
                .info-box {{ background: white; padding: 20px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }}
                ul {{ padding-left: 20px; }}
                li {{ margin: 8px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌍 Welcome to JanDrishti!</h1>
                    <p>Air Quality Updates</p>
                </div>
                
                <div class="content">
                    <div class="success-box">
                        <h2 style="margin-top: 0; color: #065f46;">✅ Subscription Successful!</h2>
                        <p>You've successfully subscribed to AQI updates{f' for {ward_no}' if ward_no else ' for all wards'}.</p>
                    </div>
                    
                    <div class="info-box">
                        <h3 style="margin-top: 0;">📬 What You'll Receive:</h3>
                        <ul>
                            <li><strong>Daily AQI Updates</strong> - Get air quality reports every morning</li>
                            <li><strong>Health Precautions</strong> - Important safety recommendations</li>
                            <li><strong>Emergency Alerts</strong> - Immediate notifications for critical conditions</li>
                        </ul>
                    </div>
                    
                    <div class="info-box">
                        <h3 style="margin-top: 0;">🔔 Notification Frequency</h3>
                        <p>You'll receive updates based on your subscription preferences. You can manage your subscription anytime from your account.</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>📱 Stay informed, stay safe! 🌱</p>
                    <p>Visit <a href="https://jandrishti.in">jandrishti.in</a> to manage your subscription</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
🌍 Welcome to JanDrishti!

✅ Subscription Successful!
You've successfully subscribed to AQI updates{f' for {ward_no}' if ward_no else ' for all wards'}.

📬 What You'll Receive:
• Daily AQI Updates - Get air quality reports every morning
• Health Precautions - Important safety recommendations
• Emergency Alerts - Immediate notifications for critical conditions

🔔 Notification Frequency
You'll receive updates based on your subscription preferences.

📱 Stay informed, stay safe! 🌱
Visit jandrishti.in to manage your subscription
        """
        
        return self.send_email(to_email, subject, html_content, text_content)

# Singleton instance
_email_service = None

def get_email_service() -> EmailService:
    """Get singleton email service instance"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
