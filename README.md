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

```sql
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

```
DuoCal/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # SQLAlchemy models
│   │   └── __init__.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.js          # Main dashboard
│   │   ├── layout.tsx       # App layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── DashboardWidget.js  # User dashboard card
│   │   ├── MealLogger.js       # Meal logging form
│   │   ├── CalorieRing.js      # Progress visualization
│   │   └── UserSettings.js     # Settings page
│   └── package.json
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
