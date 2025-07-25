"use client";
import React from "react";
import { User } from "lucide-react";
import CalorieRing from "./CalorieRing";

const DashboardWidget = ({ user }) => {
  const remainingCalories = user.targetCalories - user.consumedCalories;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-3xl w-full max-w-md flex flex-col items-center shadow-lg border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <User className="text-indigo-400" />
        {user.name}
        {"'s"} Dashboard
      </h2>
      <CalorieRing
        consumed={user.consumedCalories}
        target={user.targetCalories}
      />
      <div className="text-center mt-4 w-full">
        <p className="text-lg text-white font-semibold">
          <span className="text-indigo-400">{remainingCalories}</span> calories
          left
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{
              width: `${(user.consumedCalories / user.targetCalories) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="mt-6 w-full text-left">
        <h3 className="text-lg font-semibold text-white mb-2">
          Today{"'s"} Meals
        </h3>
        <ul className="space-y-2">
          {user.meals.map((meal, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg"
            >
              <span className="text-gray-300">{meal.name}</span>
              <span className="text-white font-medium">
                {meal.calories} kcal
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardWidget;
