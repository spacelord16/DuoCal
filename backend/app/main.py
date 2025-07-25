from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

# Models 
class Meal(BaseModel):
    name: str
    calories: int
    
class UserData(BaseModel):
    name: str
    target_calories: int
    consumed_calories: int
    meals: List[Meal]
    
app = FastAPI()

# Mock database

mock_database = {
    "current_user": {
        "name": "You",
        "target_calories": 2200,
        "consumed_calories": 1800,
        "meals": [
            {"name": "Lunch", "calories": 1000},
            {"name": "Dinner", "calories": 800},
        ],
    },
    "partner": {
        "name": "Ruchi",
        "target_calories": 1400,
        "consumed_calories": 1200,
        "meals": [
            {"name": "Breakfast", "calories": 500},
            {"name": "Lunch", "calories":700},
        ],
    }
}


# API Endpoints

@app.get("/")
def read_root():
    return {"message": "DuoCal is up and running!!!"}

@app.get("/api/users/me", response_model=UserData)
def get_current_user_data():
    return mock_database["current_user"]

@app.get("/api/users/partner", response_model=UserData)
def get_partner_data():
    return mock_database["partner"]