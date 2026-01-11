-- Email Subscriptions Schema
-- Run this SQL in your Supabase SQL Editor

-- Table to store email subscriptions
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ward_no VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    subscription_type VARCHAR(50) DEFAULT 'aqi_updates', -- 'aqi_updates', 'alerts', 'all'
    frequency VARCHAR(50) DEFAULT 'daily', -- 'hourly', 'daily', 'alerts_only'
    last_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, email)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_user_id ON email_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active ON email_subscriptions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_ward ON email_subscriptions(ward_no) WHERE ward_no IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscriptions
CREATE POLICY "Users can read own email subscriptions" ON email_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own subscriptions
CREATE POLICY "Users can insert own email subscriptions" ON email_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own subscriptions
CREATE POLICY "Users can update own email subscriptions" ON email_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete own email subscriptions" ON email_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for scheduled jobs)
CREATE POLICY "Service role can manage email subscriptions" ON email_subscriptions
    FOR ALL USING (auth.role() = 'service_role');
