"use client";
import React from "react";
import { User } from "lucide-react";
import CalorieRing from "./CalorieRing";

const DashboardWidget = ({ user }) => {
  if (!user) return null;

  const targetCalories = user.target_calories || 0;
  const consumedCalories = user.consumed_calories || 0;
  const remainingCalories = targetCalories - consumedCalories;
  const progressPercentage =
    targetCalories > 0 ? (consumedCalories / targetCalories) * 100 : 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-auto shadow-xl hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-full">
          <User className="text-indigo-400" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white text-center">
          {user.name}&apos;s Dashboard
        </h2>
      </div>

      {/* Calorie Ring */}
      <div className="flex justify-center mb-6">
        <CalorieRing consumed={consumedCalories} target={targetCalories} />
      </div>

      {/* Stats */}
      <div className="text-center mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-2xl font-bold text-white mb-1">
            {remainingCalories >= 0 ? remainingCalories : 0}
          </p>
          <p className="text-sm text-gray-400">calories remaining</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-indigo-400 font-medium">
            {Math.min(Math.round(progressPercentage), 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Today's Meals */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          Today&apos;s Meals
          <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
            {(user.meals || []).length}
          </span>
        </h3>

        {(user.meals || []).length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No meals logged yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(user.meals || []).map((meal, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800/30 border border-gray-700/30 rounded-lg p-3 hover:bg-gray-700/30 transition-colors duration-200"
              >
                <div>
                  <span className="text-white font-medium text-sm">
                    {meal.name}
                  </span>
                </div>
                <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
                  {meal.calories || 0} kcal
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardWidget;
