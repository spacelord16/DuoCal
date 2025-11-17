# 🚀 DuoCal Cloudflare Deployment Guide

This guide will help you deploy DuoCal's AI-powered version to Cloudflare for the assignment submission.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js 18+**: Install from [nodejs.org](https://nodejs.org)
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Step 1: Enable Workers AI

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **AI**
3. Click **Enable Workers AI** (free tier available)
4. Wait for activation (usually instant)

## Step 2: Deploy the Worker

1. **Navigate to worker directory**:

   ```bash
   cd worker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

   This will open a browser window for authentication.

4. **Deploy the worker**:

   ```bash
   npm run deploy
   ```

5. **Note your worker URL**:
   After deployment, you'll see output like:
   ```
   ✨  Deployed to https://duocal-ai-worker.your-subdomain.workers.dev
   ```
   **Save this URL** - you'll need it for the frontend!

## Step 3: Deploy Frontend to Cloudflare Pages

### Option A: Deploy via Wrangler (Quick)

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Create `.env.production` file**:

   ```bash
   echo "NEXT_PUBLIC_WORKER_URL=https://duocal-ai-worker.your-subdomain.workers.dev" > .env.production
   ```

   Replace `your-subdomain` with your actual worker URL.

3. **Build the project**:

   ```bash
   npm install
   npm run build
   ```

4. **Deploy to Pages**:
   ```bash
   npx wrangler pages deploy .next --project-name=duocal-ai
   ```

### Option B: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (if not already):

   ```bash
   git add .
   git commit -m "Add Cloudflare AI implementation"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** → **Pages**
   - Click **Create a project** → **Connect to Git**
   - Select your repository
   - Configure build settings:
     - **Framework preset**: Next.js
     - **Build command**: `npm run build`
     - **Build output directory**: `.next`
     - **Root directory**: `frontend`

3. **Add Environment Variable**:

   - In Pages project settings, go to **Settings** → **Environment variables**
   - Add: `NEXT_PUBLIC_WORKER_URL` = `https://duocal-ai-worker.your-subdomain.workers.dev`
   - Replace with your actual worker URL

4. **Deploy**:
   - Cloudflare will automatically build and deploy
   - Your site will be available at `https://duocal-ai.pages.dev` (or your custom domain)

## Step 4: Test Your Deployment

1. **Test the Worker**:

   ```bash
   curl -X POST https://duocal-ai-worker.your-subdomain.workers.dev/api/log-meal \
     -H "Content-Type: application/json" \
     -d '{"userId": "user1", "mealDescription": "a chicken sandwich and a side salad"}'
   ```

2. **Visit your Pages site** and test the AI meal logger!

## Step 5: Submit Your Assignment

1. **Get your GitHub repository URL**:

   - Make sure all code is pushed to GitHub
   - Copy the repository URL (e.g., `https://github.com/yourusername/DuoCal`)

2. **Submit the URL**:
   - Go to the assignment submission page
   - Paste your GitHub repository URL
   - Include a brief note about the Cloudflare deployment

## Troubleshooting

### Workers AI Not Working

- **Check AI is enabled**: Dashboard → Workers & Pages → AI
- **Verify model name**: Should be `@cf/meta/llama-3.3-8b-instruct`
- **Check worker logs**: `wrangler tail` to see errors

### Durable Objects Errors

- **First deployment**: Make sure migrations are in `wrangler.toml`
- **Check bindings**: Verify `CALORIE_LOG` binding is correct
- **Redeploy**: Sometimes a redeploy fixes binding issues

### Frontend Can't Connect to Worker

- **CORS issues**: Worker includes CORS headers, but check if they're working
- **Worker URL**: Verify `NEXT_PUBLIC_WORKER_URL` is set correctly
- **Network tab**: Check browser console for actual errors

### Build Errors

- **Node version**: Ensure Node.js 18+ is installed
- **Dependencies**: Run `npm install` in both `worker/` and `frontend/`
- **TypeScript**: Check for type errors with `npm run build`

## Local Development

To test locally before deploying:

1. **Start Worker**:

   ```bash
   cd worker
   npm run dev
   ```

2. **Start Frontend** (in another terminal):

   ```bash
   cd frontend
   export NEXT_PUBLIC_WORKER_URL=http://localhost:8787
   npm run dev
   ```

3. **Test at**: `http://localhost:3000`

## Assignment Checklist

✅ **LLM**: Llama 3.3 on Workers AI  
✅ **Workflow**: Cloudflare Worker coordinates the process  
✅ **User Input**: Natural language via Cloudflare Pages  
✅ **Memory/State**: Durable Objects store meal logs

## Additional Resources

- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## Support

If you encounter issues:

1. Check Cloudflare Dashboard for error logs
2. Run `wrangler tail` to see real-time worker logs
3. Verify all environment variables are set correctly
4. Check that Workers AI is enabled in your account

Good luck with your assignment! 🚀
