# Local Development Setup Guide

This guide explains how to run the backend locally for development while the frontend is connected to it.

## Quick Start

### Option 1: Automatic Detection (Recommended)

The frontend **automatically detects** if you're running on localhost and uses the local backend:

1. **Start Local Backend:**
   ```bash
   cd backend
   python main.py
   # Backend runs on http://localhost:8000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

3. **That's it!** The frontend will automatically use `http://localhost:8000` for API calls.

### Option 2: Manual Configuration

If you want to explicitly set the backend URL:

1. **Create `.env.local` file in frontend directory:**
   ```bash
   cd frontend
   # Create .env.local file
   ```

2. **Add this line:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Restart the frontend:**
   ```bash
   npm run dev
   ```

## How It Works

The frontend uses a smart detection system:

1. **Checks environment variable first:** `NEXT_PUBLIC_API_URL`
2. **Auto-detects localhost:** If running on `localhost` or `127.0.0.1`, uses `http://localhost:8000`
3. **Falls back to production:** Otherwise uses `https://jandrishti.onrender.com`

## Switching Between Local and Production

### Use Local Backend:
- Just run backend locally on port 8000
- Frontend automatically detects and uses it
- Or set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`

### Use Production Backend:
- Set `NEXT_PUBLIC_API_URL=https://jandrishti.onrender.com` in `.env.local`
- Or don't run local backend (frontend will use production)

## Verification

### Check Which Backend is Being Used:

1. **Open browser console** (F12)
2. **Look for this message:**
   ```
   🔧 Using Backend URL: http://localhost:8000
   ```
   or
   ```
   🔧 Using Backend URL: https://jandrishti.onrender.com
   ```

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Make an API call (e.g., login)
   - Check the request URL
   - Should show `localhost:8000` if using local backend

## Troubleshooting

### Issue: Frontend still using production backend

**Solution:**
1. Check if backend is running: `http://localhost:8000/api/health`
2. Clear browser cache
3. Restart frontend dev server
4. Check browser console for backend URL log

### Issue: CORS errors

**Solution:**
- The backend CORS middleware should handle this
- If you see CORS errors, check backend logs
- Make sure backend is running on port 8000

### Issue: API calls failing

**Check:**
1. Backend is running: `http://localhost:8000/api/health`
2. Backend logs show requests coming in
3. No firewall blocking port 8000
4. Frontend console shows correct backend URL

## Development Workflow

### Typical Development Session:

1. **Start Backend:**
   ```bash
   cd backend
   python main.py
   # Keep this terminal open
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm run dev
   # Keep this terminal open
   ```

3. **Make Changes:**
   - Edit backend code → Backend auto-reloads (if using uvicorn --reload)
   - Edit frontend code → Frontend auto-reloads (Next.js hot reload)

4. **Test Changes:**
   - Open `http://localhost:3000`
   - Frontend automatically uses local backend
   - Check browser console for backend URL confirmation

## Environment Variables

### Frontend `.env.local` (Optional):
```env
# Use local backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Or use production backend
# NEXT_PUBLIC_API_URL=https://jandrishti.onrender.com
```

### Backend `.env` (Required):
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_service_key

# Twilio (for WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Other backend configs...
```

## Production Deployment

When deploying to production:

1. **Remove or comment out** `NEXT_PUBLIC_API_URL` from `.env.local`
2. **Or set it to production URL:**
   ```env
   NEXT_PUBLIC_API_URL=https://jandrishti.onrender.com
   ```

3. The frontend will automatically use production backend when not on localhost.

## Quick Reference

| Environment | Backend URL | How to Set |
|------------|-------------|------------|
| **Local Development** | `http://localhost:8000` | Auto-detected or set in `.env.local` |
| **Production** | `https://jandrishti.onrender.com` | Default when not on localhost |

## Files Modified

- `frontend/lib/api.ts` - Updated to use `getBackendUrl()`
- `frontend/lib/backend-url.ts` - New helper function for backend URL detection
- `frontend/components/delhiaqimap.tsx` - Updated to use `getBackendUrl()`

## Notes

- The detection is based on `window.location.hostname` in the browser
- Server-side rendering will use `NODE_ENV` to detect development
- You can always override with `NEXT_PUBLIC_API_URL` environment variable
- Changes take effect after restarting the frontend dev server
