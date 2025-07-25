from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import get_db, User, Meal, Ingredient
from datetime import datetime, date


# Pydantic Models for API
class IngredientCreate(BaseModel):
    name: str
    amount: str
    calories: int


class IngredientResponse(BaseModel):
    id: int
    name: str
    amount: str
    calories: int

    class Config:
        from_attributes = True


class MealCreate(BaseModel):
    name: str
    ingredients: List[IngredientCreate]


class MealResponse(BaseModel):
    id: int
    name: str
    calories: int
    logged_at: datetime
    ingredients: List[IngredientResponse] = []

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: str
    target_calories: int = 2000
    maintenance_calories: int = 2200


class UserUpdate(BaseModel):
    target_calories: Optional[int] = None
    maintenance_calories: Optional[int] = None


class UserResponse(BaseModel):
    id: int
    name: str
    target_calories: int
    maintenance_calories: int
    consumed_calories: int
    meals: List[MealResponse] = []

    class Config:
        from_attributes = True


app = FastAPI(title="DuoCal API", description="Shared calorie tracking for couples")

# CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper function to calculate consumed calories
def calculate_consumed_calories(user: User, target_date: date = None) -> int:
    if target_date is None:
        target_date = date.today()

    total_calories = 0
    for meal in user.meals:
        if meal.logged_at.date() == target_date:
            total_calories += meal.total_calories
    return total_calories


# Helper function to get user with consumed calories
def get_user_with_calories(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # Get today's meals
    today = date.today()
    today_meals = []
    for meal in user.meals:
        if meal.logged_at.date() == today:
            meal_data = {
                "id": meal.id,
                "name": meal.name,
                "calories": meal.total_calories,
                "logged_at": meal.logged_at,
                "ingredients": meal.ingredients,
            }
            today_meals.append(meal_data)

    consumed_calories = calculate_consumed_calories(user, today)

    return {
        "id": user.id,
        "name": user.name,
        "target_calories": user.target_calories,
        "maintenance_calories": user.maintenance_calories,
        "consumed_calories": consumed_calories,
        "meals": today_meals,
    }


# Initialize default users if they don't exist
def init_default_users(db: Session):
    user1 = db.query(User).filter(User.id == 1).first()
    user2 = db.query(User).filter(User.id == 2).first()

    if not user1:
        user1 = User(id=1, name="You", target_calories=2200, maintenance_calories=2400)
        db.add(user1)

    if not user2:
        user2 = User(
            id=2,
            name="Ruchi",
            target_calories=1400,
            maintenance_calories=1600,
            partner_id=1,
        )
        db.add(user2)

    if user1 and not user1.partner_id:
        user1.partner_id = 2

    db.commit()


# API Endpoints
@app.get("/")
def read_root():
    return {"message": "DuoCal API is up and running!"}


@app.get("/api/users/me")
def get_current_user_data(db: Session = Depends(get_db)):
    init_default_users(db)
    user_data = get_user_with_calories(db, 1)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data


@app.get("/api/users/partner")
def get_partner_data(db: Session = Depends(get_db)):
    init_default_users(db)
    user_data = get_user_with_calories(db, 2)
    if not user_data:
        raise HTTPException(status_code=404, detail="Partner not found")
    return user_data


@app.post("/api/users/{user_id}/meals")
def log_meal(user_id: int, meal_data: MealCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate total calories from ingredients
    total_calories = sum(ingredient.calories for ingredient in meal_data.ingredients)

    # Create meal
    new_meal = Meal(
        user_id=user_id,
        name=meal_data.name,
        total_calories=total_calories,
        logged_at=datetime.utcnow(),
    )
    db.add(new_meal)
    db.flush()  # Get the meal ID

    # Create ingredients
    for ingredient_data in meal_data.ingredients:
        ingredient = Ingredient(
            meal_id=new_meal.id,
            name=ingredient_data.name,
            amount=ingredient_data.amount,
            calories=ingredient_data.calories,
        )
        db.add(ingredient)

    db.commit()
    db.refresh(new_meal)

    return {
        "message": "Meal logged successfully",
        "meal_id": new_meal.id,
        "total_calories": total_calories,
    }


@app.put("/api/users/{user_id}/settings")
def update_user_settings(
    user_id: int, settings: UserUpdate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if settings.target_calories is not None:
        user.target_calories = settings.target_calories
    if settings.maintenance_calories is not None:
        user.maintenance_calories = settings.maintenance_calories

    db.commit()
    return {"message": "Settings updated successfully"}


@app.get("/api/users/{user_id}/meals/today")
def get_today_meals(user_id: int, db: Session = Depends(get_db)):
    today = date.today()
    meals = (
        db.query(Meal)
        .filter(
            Meal.user_id == user_id,
            Meal.logged_at >= datetime.combine(today, datetime.min.time()),
            Meal.logged_at < datetime.combine(today, datetime.max.time()),
        )
        .all()
    )

    return meals
