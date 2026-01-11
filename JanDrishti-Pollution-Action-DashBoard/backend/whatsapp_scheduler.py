"""
WhatsApp Notification Scheduler
Sends AQI updates and precautions to subscribed users via WhatsApp
"""
import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from dotenv import load_dotenv
from supabase import create_client, Client
from twilio_service import get_twilio_service
from aqi_collector import AQICollector

load_dotenv()

logger = logging.getLogger(__name__)

class WhatsAppScheduler:
    def __init__(self):
        """Initialize WhatsApp scheduler"""
        self.scheduler = BackgroundScheduler()
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_service_key:
            logger.error("Supabase credentials not configured for WhatsApp scheduler")
            self.supabase = None
        else:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_service_key)
        
        self.twilio_service = get_twilio_service()
        self.aqi_collector = AQICollector()
        
    def start(self):
        """Start the scheduler"""
        if not self.twilio_service.is_configured():
            logger.warning("Twilio not configured. WhatsApp scheduler will not start.")
            return
        
        # Schedule AQI updates every 5 minutes
        self.scheduler.add_job(
            self.send_daily_aqi_updates,
            trigger=IntervalTrigger(minutes=5),  # Every 5 minutes
            id='daily_aqi_whatsapp',
            name='Send AQI updates via WhatsApp every 5 minutes',
            replace_existing=True
        )
        
        self.scheduler.start()
        logger.info("WhatsApp scheduler started")
    
    def shutdown(self):
        """Shutdown the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("WhatsApp scheduler stopped")
    
    def get_active_subscriptions(self, frequency: str = None) -> List[Dict]:
        """Get active WhatsApp subscriptions"""
        if not self.supabase:
            return []
        
        try:
            query = self.supabase.table("whatsapp_subscriptions").select("*").eq("is_active", True)
            if frequency:
                query = query.eq("frequency", frequency)
            response = query.execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Error fetching WhatsApp subscriptions: {e}")
            return []
    
    def get_ward_aqi_data(self, ward_no: str) -> Dict:
        """Get latest AQI data for a ward"""
        try:
            # Get latest hourly data from Redis
            latest_data = self.aqi_collector.get_latest_ward_data(ward_no)
            if latest_data:
                return latest_data
            
            # Fallback: Get from Supabase daily data
            response = self.supabase.table("ward_aqi_daily").select("*").eq("ward_no", ward_no).order("date", desc=True).limit(1).execute()
            if response.data and len(response.data) > 0:
                daily = response.data[0]
                return {
                    "aqi": daily.get("avg_aqi", 0),
                    "pm25": daily.get("avg_pm25", 0),
                    "pm10": daily.get("avg_pm10", 0),
                    "ward_name": daily.get("ward_name", f"Ward {ward_no}")
                }
            
            return None
        except Exception as e:
            logger.error(f"Error fetching AQI data for ward {ward_no}: {e}")
            return None
    
    def send_daily_aqi_updates(self):
        """Send AQI updates to all WhatsApp subscribers (every 5 minutes)"""
        logger.info("Starting AQI WhatsApp updates")
        
        # Get all active subscriptions regardless of frequency (since we send every 5 minutes)
        subscriptions = self.get_active_subscriptions(frequency=None)  # Get all active subscriptions
        logger.info(f"Found {len(subscriptions)} active WhatsApp subscriptions")
        
        for subscription in subscriptions:
            try:
                phone = subscription.get("phone_number")
                ward_no = subscription.get("ward_no")
                subscription_type = subscription.get("subscription_type", "aqi_updates")
                
                if not phone:
                    continue
                
                # Get AQI data
                if ward_no:
                    aqi_data = self.get_ward_aqi_data(ward_no)
                    if not aqi_data:
                        logger.warning(f"No AQI data found for ward {ward_no}")
                        continue
                    ward_name = aqi_data.get("ward_name", f"Ward {ward_no}")
                else:
                    # Get average AQI for all wards
                    try:
                        response = self.supabase.table("ward_aqi_daily").select("avg_aqi, avg_pm25, avg_pm10, ward_name").order("date", desc=True).limit(4).execute()
                        if response.data:
                            avg_aqi = sum(d.get("avg_aqi", 0) for d in response.data) / len(response.data)
                            avg_pm25 = sum(d.get("avg_pm25", 0) for d in response.data) / len(response.data)
                            avg_pm10 = sum(d.get("avg_pm10", 0) for d in response.data) / len(response.data)
                            aqi_data = {
                                "aqi": avg_aqi,
                                "pm25": avg_pm25,
                                "pm10": avg_pm10,
                                "ward_name": "All Wards (Average)"
                            }
                        else:
                            continue
                    except Exception as e:
                        logger.error(f"Error getting average AQI: {e}")
                        continue
                    ward_name = "All Wards"
                
                # Send AQI update
                if subscription_type in ["aqi_updates", "all"]:
                    result = self.twilio_service.send_aqi_update(phone, aqi_data, ward_name)
                    if result.get("success"):
                        logger.info(f"Sent AQI update to {phone} for {ward_name}")
                    else:
                        logger.error(f"Failed to send AQI update to {phone}: {result.get('error')}")
                
                # Send precautions if AQI is high
                aqi_value = aqi_data.get("aqi", 0)
                if aqi_value > 150 and subscription_type in ["aqi_updates", "all", "alerts"]:
                    result = self.twilio_service.send_precautions_update(phone, int(aqi_value), ward_name)
                    if result.get("success"):
                        logger.info(f"Sent precautions to {phone} for {ward_name}")
                
                # Update last_sent_at
                self.supabase.table("whatsapp_subscriptions").update({
                    "last_sent_at": datetime.utcnow().isoformat()
                }).eq("id", subscription["id"]).execute()
                
            except Exception as e:
                logger.error(f"Error sending update to {subscription.get('phone_number')}: {e}", exc_info=True)
        
        logger.info("Completed AQI WhatsApp updates")
    
    def send_critical_alerts(self):
        """Send critical AQI alerts (AQI > 200)"""
        logger.info("Checking for critical AQI alerts")
        
        subscriptions = self.get_active_subscriptions("alerts_only")
        # Also check hourly subscriptions
        hourly_subscriptions = self.get_active_subscriptions("hourly")
        subscriptions.extend(hourly_subscriptions)
        
        # Remove duplicates
        seen = set()
        unique_subscriptions = []
        for sub in subscriptions:
            sub_id = sub.get("id")
            if sub_id and sub_id not in seen:
                seen.add(sub_id)
                unique_subscriptions.append(sub)
        
        subscriptions = unique_subscriptions
        
        logger.info(f"Found {len(subscriptions)} subscriptions for critical alerts")
        
        for subscription in subscriptions:
            try:
                phone = subscription.get("phone_number")
                ward_no = subscription.get("ward_no")
                
                if not phone:
                    continue
                
                # Get AQI data
                if ward_no:
                    aqi_data = self.get_ward_aqi_data(ward_no)
                    if not aqi_data:
                        continue
                    aqi_value = aqi_data.get("aqi", 0)
                    ward_name = aqi_data.get("ward_name", f"Ward {ward_no}")
                else:
                    # Check all wards
                    try:
                        response = self.supabase.table("ward_aqi_daily").select("avg_aqi, ward_name").order("date", desc=True).limit(4).execute()
                        if response.data:
                            # Find highest AQI
                            max_aqi = max((d.get("avg_aqi", 0) for d in response.data), default=0)
                            if max_aqi < 200:
                                continue
                            aqi_value = max_aqi
                            ward_name = "Multiple Wards"
                        else:
                            continue
                    except Exception as e:
                        logger.error(f"Error checking critical alerts: {e}")
                        continue
                
                # Only send if AQI is critical (> 200)
                if aqi_value > 200:
                    result = self.twilio_service.send_precautions_update(phone, int(aqi_value), ward_name)
                    if result.get("success"):
                        logger.info(f"Sent critical alert to {phone} for {ward_name} (AQI: {aqi_value})")
                        # Update last_sent_at
                        self.supabase.table("whatsapp_subscriptions").update({
                            "last_sent_at": datetime.utcnow().isoformat()
                        }).eq("id", subscription["id"]).execute()
                
            except Exception as e:
                logger.error(f"Error sending critical alert: {e}", exc_info=True)

# Singleton instance
_whatsapp_scheduler = None

def get_whatsapp_scheduler() -> WhatsAppScheduler:
    """Get singleton WhatsApp scheduler instance"""
    global _whatsapp_scheduler
    if _whatsapp_scheduler is None:
        _whatsapp_scheduler = WhatsAppScheduler()
    return _whatsapp_scheduler
