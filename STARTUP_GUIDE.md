# Startup Guide - REON AI PREP

This guide explains how to start the application with all services properly initialized.

## 🚀 Quick Start

### Option 1: Standard Development Server
```bash
npm run dev
```

### Option 2: Using Startup Script (Recommended)
```bash
npm run dev:start
```

## 📋 Services That Start Automatically

When you start the application, the following services are initialized:

### 1. **Next.js Development Server**
- Runs on `http://localhost:3000`
- Hot module replacement enabled
- Turbopack for faster builds

### 2. **Firebase Services** (Client-side)
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Firebase Storage
- Automatically initialized when the app loads

### 3. **Neon PostgreSQL Database** (Server-side)
- ✅ Database connection pool
- ✅ Auto-initialization on first API call
- ✅ Tables created automatically if they don't exist
- Connection string configured in `src/lib/database.ts`

### 4. **Mistral AI API**
- ✅ API key configured
- ✅ Ready for LIBRA AI assistant
- ✅ Ready for quiz generation
- ✅ Ready for roadmap generation

## 🔍 Health Check

Check if all services are running:

```bash
# Using npm script
npm run health

# Or manually
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "timestamp": "2025-01-XX...",
  "services": {
    "database": "ok",
    "firebase": "initialized"
  }
}
```

## 🛠️ Manual Service Checks

### Check Database Connection
```bash
curl http://localhost:3000/api/database?action=health
```

### Check Application Health
```bash
curl http://localhost:3000/api/health
```

## 📝 Environment Variables

Make sure these are set (optional, defaults provided):

```env
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key
DATABASE_URL=postgresql://neondb_owner:...@ep-odd-grass-a19v097i-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🐛 Troubleshooting

### Server Won't Start
1. Check if port 3000 is already in use:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Kill the process if needed:
   ```bash
   taskkill /PID <process_id> /F
   ```

### Database Connection Issues
- Database initializes automatically on first API call
- Check `DATABASE_URL` environment variable
- Verify Neon database is accessible

### Firebase Issues
- Firebase initializes automatically on client-side
- Check Firebase config in `src/firebase/config.ts`
- Verify Firebase project is active

### Mistral API Issues
- Check API key in environment variables
- Fallback key is provided but may have rate limits
- Get your own key from https://console.mistral.ai/

## 📊 Service Status Indicators

When the server starts, you should see:
- ✅ Next.js compilation messages
- ✅ Server running on http://localhost:3000
- ✅ No critical errors in console

## 🎯 Next Steps After Startup

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Test Authentication**: Try Google sign-in
3. **Test LIBRA AI**: Open the sidebar and send a message
4. **Check Database**: First API call will initialize tables

## 📚 Additional Resources

- See `CHANGES_SUMMARY.md` for recent changes
- See `NETLIFY_DEPLOY.md` for deployment instructions
- See `README.md` for general project information

