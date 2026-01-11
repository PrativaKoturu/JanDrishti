-- Fix Profiles Phone Number Storage
-- Run this SQL in your Supabase SQL Editor

-- 1. Ensure phone column exists and allows NULL (it should already exist)
-- This is just a safety check
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone text;
    END IF;
END $$;

-- 2. Create or replace function to handle profile creation/update with phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', NULL),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Create function to update phone from user metadata
CREATE OR REPLACE FUNCTION public.update_profile_phone_from_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Update phone in profiles if it's in user metadata but not in profile
    IF NEW.raw_user_meta_data->>'phone_number' IS NOT NULL THEN
        UPDATE public.profiles
        SET 
            phone = NEW.raw_user_meta_data->>'phone_number',
            updated_at = NOW()
        WHERE id = NEW.id
        AND (phone IS NULL OR phone != NEW.raw_user_meta_data->>'phone_number');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to sync phone from metadata on user update
DROP TRIGGER IF EXISTS sync_phone_from_metadata ON auth.users;
CREATE TRIGGER sync_phone_from_metadata
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data->>'phone_number' IS DISTINCT FROM NEW.raw_user_meta_data->>'phone_number')
    EXECUTE FUNCTION public.update_profile_phone_from_metadata();

-- 6. Update existing profiles that have phone in metadata but not in profile
UPDATE public.profiles p
SET 
    phone = u.raw_user_meta_data->>'phone_number',
    updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
AND u.raw_user_meta_data->>'phone_number' IS NOT NULL
AND (p.phone IS NULL OR p.phone != u.raw_user_meta_data->>'phone_number');

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
