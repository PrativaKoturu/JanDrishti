"""
Email Notification Scheduler
Sends AQI updates and precautions to subscribed users via Email
"""
import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from supabase import create_client, Client
from email_service import get_email_service
from aqi_collector import AQICollector

load_dotenv()

logger = logging.getLogger(__name__)

class EmailScheduler:
    def __init__(self):
        """Initialize Email scheduler"""
        self.scheduler = BackgroundScheduler()
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_service_key:
            logger.error("Supabase credentials not configured for Email scheduler")
            self.supabase = None
        else:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_service_key)
        
        self.email_service = get_email_service()
        self.aqi_collector = AQICollector()
        
    def start(self):
        """Start the scheduler"""
        if not self.email_service.is_configured:
            logger.warning("Email service not configured. Email scheduler will not start.")
            return
        
        # Schedule daily AQI updates at 8 AM IST (2:30 AM UTC)
        self.scheduler.add_job(
            self.send_daily_aqi_updates,
            trigger=CronTrigger(hour=2, minute=30),  # 8 AM IST
            id='daily_aqi_email',
            name='Send daily AQI updates via Email',
            replace_existing=True
        )
        
        # Schedule hourly updates for critical AQI (every hour)
        self.scheduler.add_job(
            self.send_critical_alerts,
            trigger=CronTrigger(minute=0),  # Every hour
            id='hourly_critical_alerts_email',
            name='Send critical AQI alerts via Email',
            replace_existing=True
        )
        
        self.scheduler.start()
        logger.info("Email scheduler started")
    
    def shutdown(self):
        """Shutdown the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Email scheduler stopped")
    
    def get_active_subscriptions(self, frequency: str = "daily") -> List[Dict]:
        """Get active Email subscriptions"""
        if not self.supabase:
            return []
        
        try:
            response = self.supabase.table("email_subscriptions").select("*").eq("is_active", True).eq("frequency", frequency).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Error fetching email subscriptions: {e}")
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
        """Send daily AQI updates to all email subscribers"""
        logger.info("Starting daily AQI Email updates")
        
        subscriptions = self.get_active_subscriptions("daily")
        logger.info(f"Found {len(subscriptions)} daily email subscriptions")
        
        for subscription in subscriptions:
            try:
                email = subscription.get("email")
                ward_no = subscription.get("ward_no")
                subscription_type = subscription.get("subscription_type", "aqi_updates")
                
                if not email:
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
                    result = self.email_service.send_aqi_update(email, aqi_data, ward_name)
                    if result.get("success"):
                        logger.info(f"Sent AQI update email to {email} for {ward_name}")
                    else:
                        logger.error(f"Failed to send AQI update email to {email}: {result.get('error')}")
                
                # Update last_sent_at
                self.supabase.table("email_subscriptions").update({
                    "last_sent_at": datetime.utcnow().isoformat()
                }).eq("id", subscription["id"]).execute()
                
            except Exception as e:
                logger.error(f"Error sending email update to {subscription.get('email')}: {e}", exc_info=True)
        
        logger.info("Completed daily AQI Email updates")
    
    def send_critical_alerts(self):
        """Send critical AQI alerts (AQI > 200) via Email"""
        logger.info("Checking for critical AQI email alerts")
        
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
        
        logger.info(f"Found {len(subscriptions)} email subscriptions for critical alerts")
        
        for subscription in subscriptions:
            try:
                email = subscription.get("email")
                ward_no = subscription.get("ward_no")
                
                if not email:
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
                            aqi_data = {
                                "aqi": aqi_value,
                                "pm25": 0,
                                "pm10": 0,
                                "ward_name": ward_name
                            }
                        else:
                            continue
                    except Exception as e:
                        logger.error(f"Error checking critical alerts: {e}")
                        continue
                
                # Only send if AQI is critical (> 200)
                if aqi_value > 200:
                    result = self.email_service.send_aqi_update(email, aqi_data, ward_name)
                    if result.get("success"):
                        logger.info(f"Sent critical alert email to {email} for {ward_name} (AQI: {aqi_value})")
                        # Update last_sent_at
                        self.supabase.table("email_subscriptions").update({
                            "last_sent_at": datetime.utcnow().isoformat()
                        }).eq("id", subscription["id"]).execute()
                
            except Exception as e:
                logger.error(f"Error sending critical alert email: {e}", exc_info=True)

# Singleton instance
_email_scheduler = None

def get_email_scheduler() -> EmailScheduler:
    """Get singleton Email scheduler instance"""
    global _email_scheduler
    if _email_scheduler is None:
        _email_scheduler = EmailScheduler()
    return _email_scheduler
