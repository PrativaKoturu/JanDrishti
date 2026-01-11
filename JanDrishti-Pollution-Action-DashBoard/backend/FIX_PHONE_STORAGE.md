# Fix Phone Number Storage Issue

## Problem
Phone numbers are not being saved to the `profiles.phone` column during signup.

## Solution Steps

### Step 1: Run Database Fix Script

1. Open **Supabase Dashboard** → **SQL Editor**
2. Run the SQL script: `backend/fix_profiles_phone.sql`
3. This will:
   - Ensure phone column exists
   - Create/update triggers to sync phone from user metadata
   - Update existing profiles that have phone in metadata but not in profile

### Step 2: Verify Backend Code

The backend has been updated with multiple fallback mechanisms:
- ✅ Tries to insert profile with phone
- ✅ If profile exists, updates it with phone
- ✅ Uses upsert as fallback
- ✅ Updates phone on login if missing

### Step 3: Test Signup

1. **Test new signup:**
   - Sign up with a new account
   - Enter phone number: `9876543210`
   - Check Supabase `profiles` table
   - Phone should be saved as: `+919876543210`

2. **Check logs:**
   - Look for: `"Profile created/updated successfully for user ... with phone ..."`
   - If you see errors, check the error message

### Step 4: Fix Existing Users (If Needed)

If you have existing users without phone numbers:

1. **Option A: Manual Update via Supabase**
   - Go to Supabase → Table Editor → `profiles`
   - Manually add phone numbers for existing users

2. **Option B: Run SQL Update**
   ```sql
   -- Update profiles from user metadata
   UPDATE public.profiles p
   SET 
       phone = u.raw_user_meta_data->>'phone_number',
       updated_at = NOW()
   FROM auth.users u
   WHERE p.id = u.id
   AND u.raw_user_meta_data->>'phone_number' IS NOT NULL
   AND (p.phone IS NULL OR p.phone = '');
   ```

3. **Option C: Users Update on Next Login**
   - The backend now automatically syncs phone from metadata on login
   - Users will have their phone synced when they log in next time

## Verification

### Check if Phone is Saved:

1. **Via Supabase Dashboard:**
   - Go to Table Editor → `profiles`
   - Check the `phone` column
   - Should show: `+919876543210` format

2. **Via API:**
   ```bash
   # Get current user info
   GET /api/auth/me
   # Should return phone_number in response
   ```

3. **Via Frontend:**
   - Login to the app
   - Check user object in browser console
   - Should have `phone_number` field

## Troubleshooting

### Issue: Phone still not saving

**Check:**
1. ✅ Database triggers are created (run `fix_profiles_phone.sql`)
2. ✅ Backend logs show profile update attempts
3. ✅ Supabase service key has proper permissions
4. ✅ No RLS policies blocking the update

**Debug Steps:**
1. Check backend logs for errors
2. Check Supabase logs for database errors
3. Test with a new user signup
4. Verify `supabase_admin` client is using service key

### Issue: Phone format incorrect

**Expected Format:** `+919876543210`
- The backend automatically formats 10-digit numbers to E.164
- If you see different format, check the `format_phone_for_twilio()` function

### Issue: Phone missing for existing users

**Solution:**
- Run the SQL update script (Step 4, Option B)
- Or wait for users to log in (auto-sync happens on login)

## Code Changes Made

1. **Backend (`main.py`):**
   - Added `format_phone_for_twilio()` function
   - Updated signup to save phone to `profiles.phone`
   - Added multiple fallback mechanisms
   - Added phone sync on login

2. **Frontend:**
   - Made phone required in signup forms
   - Updated validation

3. **Database:**
   - Created triggers to sync phone from metadata
   - Added update script for existing data

## Testing Checklist

- [ ] Run `fix_profiles_phone.sql` in Supabase
- [ ] Test new user signup with phone
- [ ] Verify phone saved in `profiles.phone` column
- [ ] Test login - verify phone is returned
- [ ] Test WhatsApp subscription - phone should be auto-filled
- [ ] Check backend logs for any errors

## Next Steps

After fixing:
1. Test signup flow end-to-end
2. Verify WhatsApp subscription works
3. Monitor logs for any issues
4. Update existing users if needed
