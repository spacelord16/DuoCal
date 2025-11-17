# ⚡ DuoCal - Stay Healthy, Together

> A beautiful shared calorie tracking app that combines the social aspects of Locket with the health focus of MyFitnessPal. Built for couples and fitness partners to motivate each other on their health journey.

## ✨ Features

### 🎯 Stage 1 (Complete)

- **📱 Widget-Style Dashboard**: Beautiful Locket-inspired dual dashboard layout
- **🍽️ Smart Meal Logging**: Track breakfast, lunch, dinner, and snacks with detailed ingredients
- **📊 Real-time Calorie Tracking**: Visual progress rings and bars showing daily progress
- **⚙️ Flexible Settings**: Customize target and maintenance calories per user
- **👥 Partner Sharing**: See both users' progress side-by-side
- **💾 Data Persistence**: All data saved with SQLite database
- **📱 Responsive Design**: Works beautifully on all devices

### 🔮 Planned Features (Stage 2+)

- **📸 Computer Vision**: Food recognition from photos
- **🤖 Machine Learning**: Smart calorie prediction and recommendations
- **🎮 Gamification**: Streaks, achievements, and challenges
- **📈 Advanced Analytics**: Trends, insights, and progress reports
- **📱 Mobile App**: React Native companion app
- **🔔 Smart Notifications**: Meal reminders and motivation messages

## 🏗️ Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Lightweight database (easily upgradeable to PostgreSQL)
- **Pydantic** - Data validation and serialization

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern hooks
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Clean, consistent icons

### Design System

- **Glass Morphism** - Modern translucent design
- **Gradient Aesthetics** - Beautiful color transitions
- **Micro-interactions** - Smooth hover and loading states
- **Responsive Grid** - Works on all screen sizes

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **npm or yarn**

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd DuoCal
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
PYTHONPATH=. python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open Your Browser

Visit `http://localhost:3000` and start tracking! 🎉

## ☁️ Cloudflare AI Version (Assignment Implementation)

This project includes a **Cloudflare Workers AI** implementation that meets the assignment requirements for building an AI-powered application on Cloudflare.

### ✨ Cloudflare Features

- **🤖 LLM Integration**: Uses Llama 3.3 on Workers AI to parse natural language meal descriptions
- **⚡ Edge Computing**: Runs on Cloudflare's global network for low latency
- **💾 State Management**: Durable Objects store meal logs and daily totals per user
- **🔄 Real-time Processing**: Instant AI-powered calorie calculations

### 🏗️ Architecture

The Cloudflare implementation includes:

1. **Cloudflare Worker** (`worker/src/index.ts`)

   - Coordinates AI processing and state management
   - Handles API requests from the frontend
   - Integrates with Workers AI (Llama 3.3)

2. **Durable Objects** (`CalorieLog` class)

   - Stores meal data per user
   - Maintains daily calorie totals
   - Persists state across requests

3. **Frontend Integration** (`frontend/components/MealLoggerAI.js`)
   - Natural language meal input
   - Real-time AI processing feedback
   - Beautiful UI for AI-powered logging

### 🚀 Quick Start (Cloudflare Version)

#### Prerequisites

- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account with Workers AI enabled

#### Setup

1. **Install Worker Dependencies**:

   ```bash
   cd worker
   npm install
   ```

2. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

3. **Enable Workers AI**:

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → AI
   - Enable Workers AI (free tier available)

4. **Run Worker Locally**:

   ```bash
   cd worker
   npm run dev
   ```

   Worker will be available at `http://localhost:8787`

5. **Update Frontend to Use Worker**:

   ```bash
   cd frontend
   # Set environment variable
   export NEXT_PUBLIC_WORKER_URL=http://localhost:8787
   npm run dev
   ```

6. **Use AI Version**:
   - Visit `http://localhost:3000` and use the AI meal logger
   - Or use the dedicated AI page (if configured)

#### Deploy to Cloudflare

1. **Deploy Worker**:

   ```bash
   cd worker
   npm run deploy
   ```

   Note the deployed worker URL (e.g., `https://duocal-ai-worker.your-subdomain.workers.dev`)

2. **Deploy Frontend to Cloudflare Pages**:

   ```bash
   cd frontend
   # Set production worker URL
   export NEXT_PUBLIC_WORKER_URL=https://duocal-ai-worker.your-subdomain.workers.dev

   # Build and deploy
   npm run build
   npx wrangler pages deploy .next
   ```

   Or connect your GitHub repo to Cloudflare Pages for automatic deployments.

### 📋 Assignment Requirements Mapping

✅ **LLM (Llama 3.3 on Workers AI)**

- Uses `@cf/meta/llama-3.3-8b-instruct` model
- Parses natural language meal descriptions
- Returns structured JSON with calories and macronutrients

✅ **Workflow / Coordination (Cloudflare Worker)**

- Worker coordinates the entire process
- Receives user input → Calls AI → Stores in Durable Object → Returns results

✅ **User Input via Chat (Cloudflare Pages)**

- Next.js frontend deployed on Cloudflare Pages
- Natural language text input for meal descriptions
- Real-time feedback and updates

✅ **Memory / State (Durable Objects)**

- `CalorieLog` Durable Object stores meal data per user
- Maintains daily totals and meal history
- Persists state across requests and resets daily

### 🔗 API Endpoints (Cloudflare Worker)

- `POST /api/log-meal` - Log a meal using AI parsing
- `GET /api/daily-total/:userId` - Get daily calorie total
- `GET /api/meals/:userId` - Get all meals for today

See [worker/README.md](worker/README.md) for detailed API documentation.

### 📁 Project Structure (Cloudflare)

```
DuoCal/
├── worker/                    # Cloudflare Worker
│   ├── src/
│   │   └── index.ts         # Worker + Durable Object
│   ├── wrangler.toml        # Cloudflare configuration
│   └── package.json
├── frontend/
│   ├── components/
│   │   └── MealLoggerAI.js  # AI-powered meal logger
│   └── app/
│       └── page-ai.js       # AI version of main page
└── README.md
```

### 🎯 Example Usage

```bash
# Log a meal using natural language
curl -X POST https://your-worker.workers.dev/api/log-meal \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user1",
    "mealDescription": "I had a bowl of oatmeal with blueberries and a coffee"
  }'

# Response:
# {
#   "success": true,
#   "meal": {
#     "meal_name": "Oatmeal with Blueberries and Coffee",
#     "estimated_calories": 250,
#     "macronutrients": { ... }
#   },
#   "daily_total": 1250
# }
```

### 📚 Additional Resources

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

---

## 📖 API Documentation

### User Endpoints

- `GET /api/users/me` - Get current user data
- `GET /api/users/partner` - Get partner data
- `PUT /api/users/{id}/settings` - Update calorie settings

### Meal Endpoints

- `POST /api/users/{id}/meals` - Log a new meal
- `GET /api/users/{id}/meals/today` - Get today's meals

### Example Meal Logging

```bash
curl -X POST http://127.0.0.1:8001/api/users/1/meals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Breakfast",
    "ingredients": [
      {"name": "Oatmeal", "amount": "1 cup", "calories": 300},
      {"name": "Banana", "amount": "1 medium", "calories": 100}
    ]
  }'
```

## 🎨 Design Philosophy

DuoCal combines the best aspects of popular apps:

- **Locket's Widget Design** - Clean, card-based layout showing partner data
- **MyFitnessPal's Tracking** - Detailed nutrition and calorie logging
- **Snapchat's Social Elements** - Real-time sharing and motivation
- **Modern UI Principles** - Glass morphism, smooth animations, intuitive UX

## 🧪 Testing the App

### Test Meal Logging

1. Click "Log a New Meal"
2. Select meal type (Breakfast, Lunch, Dinner, Snack)
3. Add ingredients with amounts and calories
4. Submit and watch the dashboard update in real-time!

### Test Settings

1. Click "Settings"
2. Adjust target and maintenance calories
3. Save and see the changes reflected immediately
<!--

## 🗄️ Database Schema

````sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    target_calories INTEGER DEFAULT 2000,
    maintenance_calories INTEGER DEFAULT 2200,
    partner_id INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Meals table
CREATE TABLE meals (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR NOT NULL,
    total_calories INTEGER DEFAULT 0,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ingredients table
CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY,
    meal_id INTEGER REFERENCES meals(id),
    name VARCHAR NOT NULL,
    amount VARCHAR NOT NULL,
    calories INTEGER NOT NULL
);
``` -->

## 🔧 Development

### Project Structure

````

DuoCal/
├── backend/ # FastAPI backend (original)
│ ├── app/
│ │ ├── main.py # FastAPI application
│ │ ├── database.py # SQLAlchemy models
│ │ └── **init**.py
│ └── requirements.txt
├── frontend/ # Next.js frontend
│ ├── app/
│ │ ├── page.js # Main dashboard (original)
│ │ ├── page-ai.js # AI-powered version
│ │ ├── layout.tsx # App layout
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── DashboardWidget.js # User dashboard card
│ │ ├── MealLogger.js # Meal logging form (original)
│ │ ├── MealLoggerAI.js # AI-powered meal logger
│ │ ├── CalorieRing.js # Progress visualization
│ │ └── UserSettings.js # Settings page
│ └── package.json
├── worker/ # Cloudflare Worker (AI version)
│ ├── src/
│ │ └── index.ts # Worker + Durable Object
│ ├── wrangler.toml # Cloudflare configuration
│ ├── package.json
│ └── README.md # Worker documentation
└── README.md

```

### Adding New Features

1. **Backend**: Add new endpoints in `backend/app/main.py`
2. **Database**: Extend models in `backend/app/database.py`
3. **Frontend**: Create new components in `frontend/components/`
4. **Styling**: Use Tailwind classes for consistent design

## 🎯 Roadmap

### Phase 2: Computer Vision

- [ ] Camera integration for food photos
- [ ] Food recognition ML model
- [ ] Automatic calorie estimation
- [ ] Recipe scanning from images

### Phase 3: Social Features

- [ ] Friend connections beyond partners
- [ ] Group challenges and leaderboards
- [ ] Social feed with meal sharing
- [ ] Achievement system with badges

### Phase 4: Advanced Analytics

- [ ] Weekly/monthly trend analysis
- [ ] Nutrition breakdown (macros, vitamins)
- [ ] Goal tracking and progress reports
- [ ] Integration with fitness trackers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspiration**: Locket, MyFitnessPal, Snapchat
- **Design**: Modern glass morphism trends
- **Icons**: Lucide React icon library
- **Charts**: Recharts visualization library

---

<div align="center">

**Built with ❤️ for healthier relationships**

[Report Bug](https://github.com/your-username/duocal/issues) · [Request Feature](https://github.com/your-username/duocal/issues) · [Documentation](https://github.com/your-username/duocal/wiki)

</div>
```
