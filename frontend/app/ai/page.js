// File: frontend/app/ai/page.js
// Cloudflare AI-powered version of DuoCal
// Access at: http://localhost:3000/ai
"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  LoaderCircle,
  AlertTriangle,
  Settings,
  Sparkles,
} from "lucide-react";
import DashboardWidget from "../../components/DashboardWidget";
import MealLoggerAI from "../../components/MealLoggerAI";
import UserSettings from "../../components/UserSettings";

// Cloudflare Worker URL - Update this to your deployed worker URL
const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";
const USER_ID = "user1"; // In a real app, this would come from authentication

// Main App Component
export default function HomeAI() {
  const [view, setView] = useState("dashboard");

  // State for holding user data
  const [userData, setUserData] = useState(null);

  // State for managing loading and error status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from Cloudflare Worker
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch daily total and meals from Worker
      const [totalResponse, mealsResponse] = await Promise.all([
        fetch(`${WORKER_URL}/api/daily-total/${USER_ID}`),
        fetch(`${WORKER_URL}/api/meals/${USER_ID}`),
      ]);

      if (!totalResponse.ok || !mealsResponse.ok) {
        throw new Error(
          "Network response was not ok. Is the Cloudflare Worker running?"
        );
      }

      const totalData = await totalResponse.json();
      const mealsData = await mealsResponse.json();

      // Transform data to match expected format
      // Map meals from worker format to component format
      const formattedMeals = (mealsData.meals || []).map((meal) => ({
        id: meal.logged_at || Date.now(),
        name: meal.meal_name || "Meal",
        calories: meal.estimated_calories || 0,
        logged_at: meal.logged_at,
        macronutrients: meal.macronutrients,
      }));

      setUserData({
        id: 1,
        name: "You",
        target_calories: 2200, // Default, could be stored in Durable Object
        maintenance_calories: 2400,
        consumed_calories: totalData.total_calories || 0,
        meals: formattedMeals,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to refresh data (for use after logging meals)
  const refreshData = async () => {
    await fetchData();
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-white gap-6 py-16">
          <div className="relative">
            <LoaderCircle className="animate-spin text-indigo-400" size={48} />
            <Sparkles
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-300 animate-pulse"
              size={24}
            />
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-300 mb-2">
              Loading your dashboard...
            </p>
            <p className="text-sm text-gray-500">
              Fetching data from Cloudflare Worker
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Connection Error
            </h3>
            <p className="text-red-300 mb-6 text-sm leading-relaxed">{error}</p>
            <button
              onClick={refreshData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (userData) {
      return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 gap-8 px-4 max-w-2xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DashboardWidget user={userData} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 max-w-2xl mx-auto">
            <button
              onClick={() => setView("logger")}
              className="group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/20 to-indigo-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <Sparkles size={22} className="relative z-10" />
              <span className="relative z-10">Log Meal with AI</span>
            </button>
            <button
              onClick={() => setView("settings")}
              className="bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center border border-gray-600/50"
            >
              <Settings size={22} />
              Settings
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderView = () => {
    switch (view) {
      case "logger":
        return (
          <MealLoggerAI
            onBack={() => setView("dashboard")}
            onMealLogged={refreshData}
          />
        );
      case "settings":
        return (
          <UserSettings
            onBack={() => setView("dashboard")}
            userData={userData}
            onSettingsUpdated={refreshData}
          />
        );
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-8 sm:py-12">
          <div className="flex items-center justify-center gap-3 mb-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-3 bg-indigo-500/20 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
              <Zap className="text-indigo-400" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
              DuoCal AI
            </h1>
          </div>
          <p className="text-gray-400 text-lg animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
            AI-powered nutrition tracking on Cloudflare
          </p>
          <div className="flex justify-center mt-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <Sparkles className="text-indigo-400" size={16} />
              <span className="text-indigo-300 text-sm font-medium">
                Powered by Cloudflare Workers AI
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-12">{renderView()}</main>
      </div>
    </div>
  );
}
