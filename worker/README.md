# DuoCal AI Worker

Cloudflare Worker implementation for DuoCal's AI-powered meal tracking using Workers AI (Llama 3.3) and Durable Objects.

## Features

- 🤖 **AI-Powered Meal Parsing**: Uses Llama 3.3 to parse natural language meal descriptions
- 💾 **State Management**: Durable Objects store daily meal logs per user
- ⚡ **Edge Computing**: Runs on Cloudflare's global network
- 🔄 **Real-time Updates**: Instant calorie calculations and daily totals

## Architecture

### Components

1. **Cloudflare Worker** (`src/index.ts`)

   - Receives meal descriptions from frontend
   - Coordinates AI processing and state storage
   - Returns daily totals and meal history

2. **Durable Object** (`CalorieLog` class)

   - Stores meal data per user
   - Maintains daily totals
   - Persists state across requests

3. **Workers AI Integration**
   - Uses `@cf/meta/llama-3.3-8b-instruct` model
   - Parses natural language to structured meal data
   - Calculates calories and macronutrients

## Setup

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Workers AI enabled

### Installation

```bash
cd worker
npm install
```

### Development

1. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

2. **Enable Workers AI**:

   - Go to Cloudflare Dashboard → Workers & Pages → AI
   - Enable Workers AI (it's free for development)

3. **Run locally**:

   ```bash
   npm run dev
   ```

   The worker will be available at `http://localhost:8787`

### Deployment

```bash
# Deploy to production
npm run deploy

# Or deploy to a specific environment
wrangler deploy --env production
```

## API Endpoints

### POST `/api/log-meal`

Log a new meal using AI parsing.

**Request:**

```json
{
  "userId": "user1",
  "mealDescription": "I had a bowl of oatmeal with blueberries and a coffee"
}
```

**Response:**

```json
{
  "success": true,
  "meal": {
    "meal_name": "Oatmeal with Blueberries and Coffee",
    "estimated_calories": 250,
    "macronutrients": {
      "protein": 8,
      "carbs": 45,
      "fat": 5
    }
  },
  "daily_total": 1250,
  "message": "Meal logged successfully"
}
```

### GET `/api/daily-total/:userId`

Get daily calorie total for a user.

**Response:**

```json
{
  "total_calories": 1250,
  "meals": [
    {
      "meal_name": "Oatmeal with Blueberries and Coffee",
      "estimated_calories": 250,
      "logged_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET `/api/meals/:userId`

Get all meals for today.

**Response:**

```json
{
  "meals": [
    {
      "meal_name": "Oatmeal with Blueberries and Coffee",
      "estimated_calories": 250,
      "macronutrients": { ... },
      "logged_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total_calories": 1250
}
```

## Configuration

Edit `wrangler.toml` to configure:

- Worker name
- Durable Object bindings
- Environment variables
- Routes

## Testing

Test the worker locally:

```bash
# Start dev server
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:8787/api/log-meal \
  -H "Content-Type: application/json" \
  -d '{"userId": "user1", "mealDescription": "a chicken sandwich and a side salad"}'
```

## How It Works

1. **User Input**: Frontend sends natural language meal description
2. **AI Processing**: Worker sends prompt to Llama 3.3 via Workers AI
3. **Parsing**: AI returns structured JSON with calories and macros
4. **Storage**: Meal data stored in Durable Object (per user)
5. **Response**: Daily total and meal details returned to frontend

## Assignment Requirements Mapping

✅ **LLM**: Uses Llama 3.3 on Workers AI  
✅ **Workflow/Coordination**: Cloudflare Worker coordinates the process  
✅ **User Input**: Natural language via chat interface (Cloudflare Pages)  
✅ **Memory/State**: Durable Objects store meal logs per user

## Troubleshooting

### Workers AI not available

- Ensure Workers AI is enabled in your Cloudflare dashboard
- Check that you're using the correct model name: `@cf/meta/llama-3.3-8b-instruct`

### Durable Objects errors

- Make sure the binding name matches in `wrangler.toml`
- Verify the class is exported correctly

### CORS issues

- CORS headers are included in the worker
- For production, update allowed origins in the worker code

## License

MIT
