# 🚀 Quick Start Guide - Test DuoCal AI Locally

This guide will help you test the AI-powered DuoCal locally before deploying to Cloudflare.

## Current Status

✅ **What's Ready:**

- Cloudflare Worker code with AI integration
- Frontend AI components
- Durable Objects for state management
- All configuration files

⚠️ **What You Need to Do:**

- Install dependencies
- Start the Worker locally
- Start the Frontend
- Test the AI meal logger

## Step-by-Step Testing

### 1. Install Worker Dependencies

```bash
cd worker
npm install
```

### 2. Start the Cloudflare Worker (Terminal 1)

```bash
cd worker
npm run dev
```

**Expected output:**

```
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**Keep this terminal open!** The worker needs to stay running.

### 3. Start the Frontend (Terminal 2)

Open a **new terminal window** and run:

```bash
cd frontend
export NEXT_PUBLIC_WORKER_URL=http://localhost:8787
npm run dev
```

**Expected output:**

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
```

### 4. Access the App

Open your browser and go to:

- **Original Version**: http://localhost:3000 (uses FastAPI backend)
- **AI Version**: http://localhost:3000/ai (uses Cloudflare Worker + AI)

### 5. Test the AI Meal Logger

1. Go to http://localhost:3000/ai
2. Click **"Log Meal with AI"** button
3. Type a natural language description, for example:
   - "I had a bowl of oatmeal with blueberries and a coffee"
   - "A chicken sandwich and a side salad"
   - "Two slices of pizza and a soda"
4. Click **"Log Meal with AI"**
5. Watch the AI process your meal and calculate calories!

## What You Should See

### On the AI Page (`/ai`):

1. **Dashboard View:**

   - "DuoCal AI" header
   - "Powered by Cloudflare Workers AI" badge
   - Your daily calorie total (starts at 0)
   - "Log Meal with AI" button

2. **When Logging a Meal:**

   - Text area for natural language input
   - Example meal descriptions
   - Loading state with "Analyzing with AI..." message
   - Success message showing:
     - Meal name (parsed by AI)
     - Estimated calories
     - Macronutrients (protein, carbs, fat)

3. **After Logging:**
   - Dashboard updates with new total
   - Meal appears in "Today's Meals" list

## Troubleshooting

### Worker Won't Start

**Error: "Workers AI not available"**

- You need to enable Workers AI in Cloudflare Dashboard
- Go to: https://dash.cloudflare.com → Workers & Pages → AI
- Click "Enable Workers AI"
- Then try `npm run dev` again

**Error: "Cannot find module"**

- Run `npm install` in the `worker/` directory
- Make sure you're in the correct directory

### Frontend Can't Connect to Worker

**Error: "Network response was not ok"**

- Check that the worker is running on port 8787
- Verify `NEXT_PUBLIC_WORKER_URL=http://localhost:8787` is set
- Check browser console for CORS errors

**Error: "Failed to fetch"**

- Make sure the worker terminal is still running
- Try restarting both worker and frontend

### AI Not Working

**Error: "AI parsing error"**

- The worker will use a fallback calorie estimation
- Check worker terminal for error messages
- Verify Workers AI is enabled in Cloudflare Dashboard

**No response from AI:**

- Check worker logs in the terminal
- The fallback system should still work and estimate calories

## Testing Different Scenarios

### Test 1: Simple Meal

```
Input: "a chicken sandwich"
Expected: ~500 calories, parsed meal name
```

### Test 2: Complex Meal

```
Input: "I had a bowl of oatmeal with blueberries, a banana, and a cup of coffee"
Expected: ~400-500 calories, detailed breakdown
```

### Test 3: Multiple Meals

```
1. Log "a chicken sandwich" → Should show ~500 calories
2. Log "a side salad" → Should show total ~650 calories
3. Check dashboard → Should show both meals
```

## Next Steps

Once local testing works:

1. **Deploy to Cloudflare** (see `DEPLOYMENT.md`)
2. **Update Worker URL** in frontend environment variables
3. **Test on production** Cloudflare URLs
4. **Submit your assignment** with GitHub repo URL

## Quick Commands Reference

```bash
# Terminal 1 - Worker
cd worker
npm install          # First time only
npm run dev          # Start worker

# Terminal 2 - Frontend
cd frontend
export NEXT_PUBLIC_WORKER_URL=http://localhost:8787
npm run dev          # Start frontend

# Then visit:
# http://localhost:3000/ai
```

## Need Help?

- Check `worker/README.md` for Worker details
- Check `DEPLOYMENT.md` for deployment steps
- Check browser console for frontend errors
- Check worker terminal for backend errors

Happy testing! 🎉
